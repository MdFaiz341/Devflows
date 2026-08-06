import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCanvasStore } from "../../Storage/useCanvasStore";

export function CanvasNotificationUI() {
    const notification = useCanvasStore((state) => state.notificationBar);

    const clearNotificationBar = useCanvasStore((state) => state.clearNotificationBar);

    const notificationRef = useRef(false);

    useEffect(() => {
        if (!notification || notificationRef.current) return;

        notificationRef.current = true;

        toast.info(notification);

        const timer = setTimeout(() => {
            notificationRef.current = false;
            clearNotificationBar();
        }, 2000);

        return () => clearTimeout(timer);
    }, [notification, clearNotificationBar]);

    return null;
}