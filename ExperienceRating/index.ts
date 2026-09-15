import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class StarRating
implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;

    // Current committed rating (can be a half value, e.g. 3.5)
    private selectedRating = 0;

    // Value currently being previewed on hover (null when not hovering)
    private hoverValue: number | null = null;

    // Resolved config for the current updateView pass
    private title = "Rate your experience";
    private shapeKey = "0";
    private colorKey = "0";
    private customColor = "";
    private maxRating = 5;
    private sizeKey = "1";
    private showCounter = false;
    private showLabels = false;
    private labels: string[] = [];
    private allowClear = true;
    private readOnly = false;
    private enableAnimation = true;

    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(
        context: ComponentFramework.Context<IInputs>
    ): void {
        const p = context.parameters;

        const ratingValue = p.rating.raw;
        if (ratingValue !== null && ratingValue !== undefined) {
            this.selectedRating = ratingValue;
        }

        this.title = p.title?.raw ?? "Rate your experience";
        this.shapeKey = p.shape.raw ?? "0";
        this.colorKey = p.color.raw ?? "0";
        this.customColor = p.customColor?.raw ?? "";
        this.sizeKey = p.size.raw ?? "1";

        const maxRatingRaw = p.maxRating?.raw;
        this.maxRating =
            maxRatingRaw !== null && maxRatingRaw !== undefined && maxRatingRaw > 0
                ? Math.min(maxRatingRaw, 20)
                : 5;

        this.showCounter = p.showCounter?.raw ?? false;
        this.showLabels = p.showLabels?.raw ?? false;
        this.allowClear = p.allowClear?.raw ?? true;
        this.readOnly = p.readOnly?.raw ?? false;
        this.enableAnimation = p.enableAnimation?.raw ?? true;

        const labelsRaw = p.labels?.raw ?? "";
        this.labels = labelsRaw
            .split(",")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

        // Clamp a stored rating that no longer fits the configured range
        if (this.selectedRating > this.maxRating) {
            this.selectedRating = this.maxRating;
        }

        this.render();
    }

    public getOutputs(): IOutputs {
        return {
            rating: this.selectedRating
        };
    }

    public destroy(): void {
        this.container.innerHTML = "";
    }

    // ---------- helpers ----------

    private getShapeChar(): string {
        switch (this.shapeKey) {
            case "1":
                return "♥";
            case "2":
                return "♦";
            case "3":
                return "●";
            case "4":
                return "■";
            case "5":
                return "▲";
            case "0":
            default:
                return "★";
        }
    }

    private isValidHex(value: string): boolean {
        return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value.trim());
    }

    private getColor(): string {
        switch (this.colorKey) {
            case "1":
                return "#E03131";
            case "2":
                return "#0078D4";
            case "3":
                return "#107C10";
            case "4":
                return "#800080";
            case "5":
                return this.isValidHex(this.customColor) ? this.customColor.trim() : "#FFD700";
            case "0":
            default:
                return "#FFD700";
        }
    }

    private getIconSizePx(): number {
        switch (this.sizeKey) {
            case "0":
                return 22;
            case "2":
                return 52;
            case "1":
            default:
                return 36;
        }
    }

    private formatRatingNumber(value: number): string {
        return Number.isInteger(value) ? String(value) : value.toFixed(1);
    }

    private commitRating(newValue: number): void {
        const clamped = Math.max(0, Math.min(this.maxRating, newValue));

        // Clicking the exact same value again clears it, when enabled
        if (this.allowClear && clamped === this.selectedRating) {
            this.selectedRating = 0;
        } else {
            this.selectedRating = clamped;
        }

        this.hoverValue = null;
        this.notifyOutputChanged();
        this.render();
    }

    private getDisplayValue(): number {
        return this.hoverValue !== null ? this.hoverValue : this.selectedRating;
    }

    private getLabelForValue(value: number): string {
        if (value <= 0) {
            return this.labels.length > 0 ? "Select a rating" : "Select a rating";
        }
        const index = Math.ceil(value) - 1;
        if (this.labels.length > 0 && this.labels[index]) {
            return this.labels[index];
        }
        return `${this.formatRatingNumber(value)} / ${this.maxRating}`;
    }

    // ---------- rendering ----------

    private render(): void {
        this.container.innerHTML = "";

        const shapeChar = this.getShapeChar();
        const activeColor = this.getColor();
        const iconPx = this.getIconSizePx();
        const displayValue = this.getDisplayValue();

        const card = document.createElement("div");
        card.style.padding = "15px";
        card.style.borderRadius = "12px";
        card.style.textAlign = "center";
        card.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        card.style.fontFamily = "Segoe UI, Arial, sans-serif";
        card.style.maxWidth = "360px";
        card.style.boxSizing = "border-box";

        if (this.title && this.title.trim().length > 0) {
            const title = document.createElement("div");
            title.innerText = this.title;
            title.style.fontSize = "18px";
            title.style.fontWeight = "bold";
            title.style.marginBottom = "10px";
            card.appendChild(title);
        }

        // Group wrapper: also the keyboard-accessible slider
        const group = document.createElement("div");
        group.style.display = "flex";
        group.style.justifyContent = "center";
        group.style.gap = "6px";
        group.style.outline = "none";

        if (!this.readOnly) {
            group.tabIndex = 0;
            group.setAttribute("role", "slider");
            group.setAttribute("aria-valuemin", "0");
            group.setAttribute("aria-valuemax", String(this.maxRating));
            group.setAttribute("aria-valuenow", String(this.selectedRating));
            group.setAttribute("aria-label", this.title || "Rating");

            group.addEventListener("keydown", (e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    e.preventDefault();
                    this.commitRating(this.selectedRating + 1);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    e.preventDefault();
                    this.commitRating(this.selectedRating - 1);
                } else if (e.key === "Home") {
                    e.preventDefault();
                    this.commitRating(0);
                } else if (e.key === "End") {
                    e.preventDefault();
                    this.commitRating(this.maxRating);
                }
            });

            group.addEventListener("mouseleave", () => {
                if (this.hoverValue !== null) {
                    this.hoverValue = null;
                    this.render();
                }
            });
        }

        for (let i = 1; i <= this.maxRating; i++) {
            const fill = Math.max(0, Math.min(1, displayValue - (i - 1)));
            const effectiveFill = fill >= 1 ? 1 : 0;

            const wrapper = document.createElement("span");
            wrapper.style.position = "relative";
            wrapper.style.display = "inline-block";
            wrapper.style.width = `${iconPx}px`;
            wrapper.style.height = `${iconPx}px`;
            wrapper.style.lineHeight = `${iconPx}px`;
            wrapper.style.fontSize = `${iconPx}px`;
            wrapper.style.userSelect = "none";
            wrapper.style.transition = "transform 0.15s ease";
            wrapper.style.cursor = this.readOnly ? "default" : "pointer";

            const back = document.createElement("span");
            back.innerText = shapeChar;
            back.style.position = "absolute";
            back.style.left = "0";
            back.style.top = "0";
            back.style.color = "#D8D8D8";
            wrapper.appendChild(back);

            if (effectiveFill > 0) {
                const front = document.createElement("span");
                front.innerText = shapeChar;
                front.style.position = "absolute";
                front.style.left = "0";
                front.style.top = "0";
                front.style.color = activeColor;
                front.style.width = `${effectiveFill * 100}%`;
                front.style.overflow = "hidden";
                front.style.whiteSpace = "nowrap";
                wrapper.appendChild(front);
            }

            if (!this.readOnly) {
                wrapper.addEventListener("mousemove", () => {
                    if (this.hoverValue !== i) {
                        this.hoverValue = i;
                        this.render();
                    }
                });

                wrapper.addEventListener("click", () => {
                    const value = i;

                    if (this.enableAnimation) {
                        wrapper.style.transform = "scale(1.3)";
                        setTimeout(() => {
                            wrapper.style.transform = "scale(1)";
                        }, 140);
                    }

                    this.commitRating(value);
                });
            }

            group.appendChild(wrapper);
        }

        card.appendChild(group);

        if (this.showLabels) {
            const labelEl = document.createElement("div");
            labelEl.style.marginTop = "10px";
            labelEl.style.fontSize = "13px";
            labelEl.style.fontWeight = "600";
            labelEl.style.color = "#555555";
            labelEl.style.minHeight = "16px";
            labelEl.innerText = this.getLabelForValue(displayValue);
            card.appendChild(labelEl);
        }

        if (this.showCounter) {
            const counter = document.createElement("div");
            counter.style.marginTop = this.showLabels ? "4px" : "12px";
            counter.style.fontSize = "14px";
            counter.style.fontWeight = "bold";
            counter.innerText =
                this.selectedRating > 0
                    ? `${this.formatRatingNumber(this.selectedRating)} / ${this.maxRating}`
                    : "Select a rating";
            card.appendChild(counter);
        }

        this.container.appendChild(card);
    }
}
