const getProducts = () => [
    { id: 1, name: 'My first product' },
    { id: 2, name: 'My second product' },
    { id: 3, name: 'My third product' },
];

const getPersons = () => [
    { id: 0, name: 'Donna Benson' },
    { id: 1, name: 'Rose Larson' },
    { id: 2, name: 'Adrienne Bruce' },
];

const getInnerTextProducts = products => products.map(product => `${product.id} -> ${product.name}`);

const fireNativeEventToHTMLElement = (nativeEventString, htmlElement) => {
    const event = new Event(nativeEventString, { bubbles: true, cancelable: true, composed: true });
    htmlElement.dispatchEvent(event);
};
