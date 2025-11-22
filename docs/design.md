# App Design

## Why

Back when I started this project, it was just for fun. I decided not to use a design system since I
was mostly just copying the Lexica app, and, at the time, I didn't love the rigidity of the common
material design systems available in React. So, instead of using an existing design system, I blazed
my own trail. Each time a button was required, I would program one, css and all, on the spot. The
same went for every common component.

Now it's time for the next step in Web Lexica's design system journey. I can't keep this up, and
the app doesn't look too great.

## What Design system?

Material Design is pretty popular. At the time of writing, it's on its third iteration. Now, as
much as I hate coding everything by hand, I also still am not ready to take a step into just using
a standardized react design system library. That said, I do want to step closer towards Material
Design's philosophies. What will ensue is almost certainly not going to be amazing, but there's no
designer on the team.

## The Rules

Here's some standardized rules that are more or less inspired from a brief look-through of Material
Design's specifications.

Note: These are extremely loose rules, Material Design has many more rules than what is listed
here, but again, I'm not a designer, so these are the ones I'm kind of paying attention to.

### Font

Roboto is going to be considered the main font of the app.

### Font sizing


#### Portrait Base Font Sizing

The ratio of the screen will be determined, if the screen is at least 3:4 ratio, this rule will kick in, otherwise the `Landscape base font sizing` rule will be used

On portrait screens, the font will be whatever amount of pixels it takes to fit 25 'M' characters in the standard font at the standard weight (400).

The equation for getting the font size is as follows: `1.1454 * 100vw / 25`

#### Landscape Base Font Sizing

On landscape screens, the base font will be 16px, which is standard across all major browsers.


#### Sizes beyond the base size

From that base font, there will be several sizes:

8 steps above standard size and 2 steps below it.

Each step will have a 1.2 (Minor Third) ratio between it. This deviates from Material Design, but it makes it quite a bit easier to program.

Here's a list of all possible font sizes (assuming a 16px base size):

```
  8. 68.80px
  7. 57.33px
  6. 47.78px
  5. 39.81px
  4. 33.18px
  3. 27.65px
  2. 23.04px
  1. 19.20px
  0. 16.00px
 -1. 13.33px
 -2. 11.11px
```

For ease of use, we will split these into the groups used by Material Design:

  - Display (sizes 6 to 8)
  - Headline (sizes 3 to 5)
  - Title (sizes 0 to 2)
  - Body (sizes -1 to 1)
  - Label (sizes 0 to -2)

These sizes will be calculated on the fly as follows:

```
base-font-size * pow(1.2, step-number)
```

### Line height

The line height will be 1.3 times as large as the font size

### Padding

The standard padding for any step will be 2/3rds the font size.

To keep the system fairly flexible, while programming, you can choose to change this based on your needs and what looks good. There will be 3 modification options:

1. small (padding for one step down on the font scale)
1. normal (no change in standard size)
1. large (padding for one step up on the font scale)
