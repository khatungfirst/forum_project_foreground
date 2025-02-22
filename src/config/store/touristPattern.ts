import { defineStore } from 'pinia';

export const useTouristPattern = defineStore('touristPattern', {
    state: () => ({
        triggerType: '',
        triggerContent: 0
    }),
    actions: {
        setType(type: string) {
            this.triggerType = type;
        },
        getType() {
            return this.triggerType;
        },
        setTriggerId(content: number) {
            this.triggerContent = content;
        },
        getTriggerId() {
            return this.triggerContent;
        }
    }
});
