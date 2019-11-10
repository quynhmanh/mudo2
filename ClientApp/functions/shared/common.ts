export const isClickOutside = (event, element) => {
    const { clientX, clientY } = event;
    const rect = element.getBoundingClientRect();
    return (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom);
}