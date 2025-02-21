import { defineStore } from 'pinia';

export const useTouristPattern = defineStore('touristPattern', {
    state: () => ({
        triggerType: ''
    }),
    actions: {
        setType(type: string) {
            this.triggerType = type;
        },
        getType() {
            return this.triggerType;
        }
    }
});
