class plot2D {
  constructor(func_string, color) {
    this.func_string = func_string;
    this.color = color;
    this.id = (Math.random() + 1).toString(36).substring(7);
  }
}

export { plot2D };
