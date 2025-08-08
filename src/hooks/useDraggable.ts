import { useState, useRef, useCallback } from 'react';

interface Position {
    x: number;
    y: number;
}

export const useDraggable = () => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<HTMLDivElement>(null);
    const initialMousePos = useRef<Position>({ x: 0, y: 0 });
    const initialElementPos = useRef<Position>({ x: 0, y: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = dragRef.current?.getBoundingClientRect();
        if (!rect) return;

        setIsDragging(true);
        initialMousePos.current = { x: e.clientX, y: e.clientY };
        initialElementPos.current = { x: rect.left, y: rect.top };

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();

            const deltaX = e.clientX - initialMousePos.current.x;
            const deltaY = e.clientY - initialMousePos.current.y;

            setPosition({
                x: initialElementPos.current.x + deltaX,
                y: initialElementPos.current.y + deltaY
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    return {
        position,
        isDragging,
        dragRef,
        handleMouseDown
    };
}; 