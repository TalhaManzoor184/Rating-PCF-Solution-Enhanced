/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    rating: ComponentFramework.PropertyTypes.WholeNumberProperty;
    title: ComponentFramework.PropertyTypes.StringProperty;
    shape: ComponentFramework.PropertyTypes.EnumProperty<"0" | "1" | "2" | "3" | "4" | "5">;
    color: ComponentFramework.PropertyTypes.EnumProperty<"0" | "1" | "2" | "3" | "4" | "5">;
    customColor: ComponentFramework.PropertyTypes.StringProperty;
    maxRating: ComponentFramework.PropertyTypes.WholeNumberProperty;
    size: ComponentFramework.PropertyTypes.EnumProperty<"0" | "1" | "2">;
    showCounter: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    showLabels: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    labels: ComponentFramework.PropertyTypes.StringProperty;
    allowClear: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    readOnly: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    enableAnimation: ComponentFramework.PropertyTypes.TwoOptionsProperty;
}
export interface IOutputs {
    rating?: number;
}
