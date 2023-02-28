const getName = () => {
    console.log("Hello node28");
}

const getNumber = () => {
    console.log(9999);

}

// export default getName
// export {
//     getName,
//     getNumber
// }

// module.exports = getName
module.exports = {
    getName,
    getNumber
}