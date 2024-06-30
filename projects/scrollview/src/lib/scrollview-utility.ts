export class ScrollviewUtility {
    private static colorChange: boolean = false;
    private static observer: MutationObserver | null = null;



    static setVerticalColors() {
        ScrollviewUtility.updateVerticalColors();
        ScrollviewUtility.initializeObserver();
        ScrollviewUtility.initiateObserver();
    }



    private static initializeObserver() {
        if (ScrollviewUtility.observer) ScrollviewUtility.observer.disconnect();
        ScrollviewUtility.observer = new MutationObserver((mutations: MutationRecord[]) => {
            ScrollviewUtility.onColorChange(mutations);
        });
    }



    private static initiateObserver() {
        ScrollviewUtility.observer?.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style']
        });
    }



    private static onColorChange(mutations: MutationRecord[]) {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                if (!ScrollviewUtility.colorChange) {
                    ScrollviewUtility.colorChange = true;
                    ScrollviewUtility.updateVerticalColors();
                    setTimeout(() => {
                        ScrollviewUtility.colorChange = false;
                    });
                }
            }
        });
    }



    private static updateVerticalColors() {
        const colors = [
            '--scrollbar-track-border-color',
            '--scrollbar-thumb-border-color',
            '--scrollbar-button-border-color',
            '--scrollbar-thumb-background-color',
            '--scrollbar-track-background-color',
            '--scrollbar-button-background-color',
            '--scrollbar-thumb-border-hover-color',
            '--scrollbar-thumb-border-active-color',
            '--scrollbar-button-border-hover-color',
            '--scrollbar-button-border-active-color',
            '--scrollbar-thumb-background-hover-color',
            '--scrollbar-button-border-disabled-color',
            '--scrollbar-button-background-hover-color',
            '--scrollbar-thumb-background-active-color',
            '--scrollbar-button-background-active-color',
            '--scrollbar-button-background-disabled-color'
        ];
    
        colors.forEach(color => {
            
            ScrollviewUtility.updateVerticalColor(color, color.replace('--scrollbar-', '--scrollbar-vertical-'));
        });
    }
    
    private static updateVerticalColor(oldColorVariable: string, newColorVariable: string) {
        const linearGradientRegex = /linear-gradient\(([^)]+)\)/;
        const colorValue = getComputedStyle(document.documentElement).getPropertyValue(oldColorVariable).trim();
        const match = colorValue.match(linearGradientRegex);
    
        if (match) {
            const gradientContent = match[1];
            document.documentElement.style.setProperty(newColorVariable, `linear-gradient(to right, ${gradientContent})`);
        } else {
            document.documentElement.style.setProperty(newColorVariable, colorValue);
        }
    }
}