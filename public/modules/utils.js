function NotImplementedFunctionality(message = "This functionality is unimplemented"){
    this.name = "NotImplementedException";
    this.message = message;
}

NotImplementedFunctionality.prototype = Error.prototype;

let NotImplementedError = new NotImplementedFunctionality();

export { NotImplementedError }