Glint

A dependency-free rating control for Power Apps with full keyboard accessibility, six icon shapes, custom colors, and a configurable scale.

<img width="542" height="498" alt="image" src="https://github.com/user-attachments/assets/b39edc86-fe52-4563-87e8-8c21c6435891" /></br>

<img width="536" height="477" alt="image" src="https://github.com/user-attachments/assets/b441af6e-8bd7-48d9-b4f3-738bb82d5030" /></br>

<img width="382" height="882" alt="image" src="https://github.com/user-attachments/assets/f2a35c2e-0b72-4d9d-a025-67d5435af9e5" /></br>



Overview

Glint is a lightweight rating control for model-driven apps, canvas apps, and Power Pages. Unlike alternatives built on React, Fluent UI, or Font Awesome, it ships as a single small bundle with no external libraries — nothing to load, nothing to version-conflict with.

Everything is configurable from the maker properties panel. No code changes required.

**Features**

Zero dependencies — no React, no icon fonts, no CSS frameworks
Fully keyboard accessible — exposed as an ARIA slider; arrow keys, Home and End all work
Dynamic heading text — set your own, or leave blank to hide it entirely
Six icon shapes — star, heart, diamond, circle, square, triangle
Custom colors — five presets plus any hex value you want
Configurable scale — 5, 10, or anything up to 20
Optional numeric counter — off by default for a cleaner look
Custom hover labels — e.g. Poor → Fair → Good → Very Good → Excellent
Click-to-clear — click the selected icon again to reset to zero
Read-only mode — display existing ratings without allowing edits
Three icon sizes — small, medium, large

**Optional selection animation**

<img width="388" height="886" alt="image" src="https://github.com/user-attachments/assets/03b35ecb-4bad-423f-8773-13ac96fa6a9a" />


Installation

Download the latest managed or unmanaged solution from the Releases page, then import it into your environment:

Go to make.powerapps.com
Select your environment → Solutions → Import solution
Browse to the downloaded .zip and complete the import
Publish all customizations
Usage
Open the form editor for your table
Select the whole number column you want to bind the rating to
Under Components, choose + Component → StarRatingPlus
Enable it for Web, Phone, and Tablet as needed
Configure the properties below, then save and publish

**Properties**
Property	Type	Default	Description

rating	Whole Number (bound)	—	The column that stores the rating value
title	Text	Rate your experience	Heading shown above the icons. Leave blank to hide
shape	Enum	Star	Star, Heart, Diamond, Circle, Square, or Triangle
color	Enum	Gold	Gold, Red, Blue, Green, Purple, or Custom
customColor	Text	—	Hex color used when color is set to Custom, e.g. 
#FF6B00
maxRating	Whole Number	5	Number of icons to render (max 20)
size	Enum	Medium	Small, Medium, or Large
showCounter	Two Options	false	Show the numeric value (e.g. 3 / 5) below the icons
showLabels	Two Options	false	Show a text label matching the hovered or selected value
labels	Text	—	Comma-separated labels, one per level
allowClear	Two Options	true	Clicking the selected icon again resets to zero
readOnly	Two Options	false	Display-only mode
enableAnimation	Two Options	true	Subtle pop animation on selection

Note: rating binds to a Whole Number column. Binding it to a decimal or text column will cause the control to fail to initialize.

**Example configurations

Clean five-star rating

title       = Rate your experience
shape       = Star
color       = Gold
maxRating   = 5
size        = Medium
showCounter = false
showLabels  = false

Ten-point survey scale with labels

title       = How was our service?
shape       = Circle
color       = Custom
customColor = #FF6B00
maxRating   = 10
size        = Large
showCounter = true
showLabels  = true

Read-only display for existing reviews

title       = (blank)
shape       = Star
color       = Gold
maxRating   = 5
size        = Small
readOnly    = true
showCounter = true
Accessibility**

The icon group is focusable and exposed to assistive technology as an ARIA slider with aria-valuemin, aria-valuemax, and aria-valuenow. Keyboard users can:

Key	Action
→ / ↑	Increase the rating by one
← / ↓	Decrease the rating by one
Home	Reset to zero
End	Set to the maximum

In read-only mode the control is removed from the tab order, since there is nothing to interact with.

Building from source

Requires Node.js and the Power Platform CLI.

bash
npm install
npm start          # local test harness with a live properties panel
npm run build      # production build

To produce a solution package:

bash
mkdir Solutions && cd Solutions
pac solution init --publisher-name yourname --publisher-prefix abc
pac solution add-reference --path ..
msbuild /t:build /restore

The packaged solution appears under Solutions/bin/Debug.

Contributing

Issues and pull requests are welcome. If you are reporting a rendering problem, please include your environment type (model-driven, canvas, or Power Pages) and a screenshot
