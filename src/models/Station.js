class Station {
  constructor(obj) {
    this.id = +obj.id;
    this.name = obj.name;
    this.latitude = +obj.latitude;
    this.longitude = +obj.longitude;
  }

  toString() {
    return this.name;
  }
}

export default Station;
