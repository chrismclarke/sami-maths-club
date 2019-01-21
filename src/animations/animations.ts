//https://www.joshmorony.com/creating-an-achievement-unlocked-animation-with-angular-animations-in-ionic/
import {
  trigger,
  style,
  animate,
  transition,
  group,
  query,
  animateChild
} from "@angular/animations";
export const FadeIn = trigger("fadein", [
  transition(":enter", [
    style({ opacity: "0" }),
    group([animate("500ms ease-out", style({ opacity: "1" }))])
  ]),
  transition(":leave", [
    group([animate("500ms ease-out", style({ opacity: "0" }))])
  ])
]);
