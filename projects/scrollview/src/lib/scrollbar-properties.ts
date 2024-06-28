import { ButtonIcon } from "./button-icon";

export class ScrollbarProperties {
    public width!: string
    public trackBorderWidth!: string;
    public thumbBorderWidth!: string;
    public buttonBorderWidth!: string;
    public buttonIcon: ButtonIcon = new ButtonIcon();
  }