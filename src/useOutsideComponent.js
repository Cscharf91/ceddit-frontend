import { useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */

function useOutsideComponent(ref, deleteComponent) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                ref.current.remove();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);
}

export default useOutsideComponent;