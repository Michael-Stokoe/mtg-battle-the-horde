

const functions = {
    arraySum: function (items, prop) {
        return items.reduce((a,b) => a + b[prop], 0);
    },


}

export default functions;