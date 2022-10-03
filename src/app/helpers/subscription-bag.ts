import { Subscription } from 'rxjs';

export interface SubscriptionLike {
    unsubscribe(): void;
}

export class SubscriptionBag {

    private subscriptions: SubscriptionLike[] = [];
    private subsBags: SubscriptionBag[] = [];

    public set add(sub: Subscription | SubscriptionBag | SubscriptionLike) {
        if (sub instanceof SubscriptionBag) {
            this.subsBags.push(sub);
            return;
        }
        this.subscriptions.push(sub);
    }

    dispose(): void {
        this.disposeSubsLikes();
        this.disposeSubsBags();
    }

    private disposeSubsLikes(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private disposeSubsBags(): void {
        this.subsBags.forEach(bag => bag.dispose());
    }

}