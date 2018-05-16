class Station {
  constructor(obj, areas) {
    this.id = +obj.id;
    this.name = obj.name;
    this.latitude = +obj.latitude;
    this.longitude = +obj.longitude;
    this.area = this.findArea(this.latitude, this.longitude, areas);
  }

  findArea(lat, lon, areas) {
    const area = areas.find(e => {
      return (
        lat >= e.minLat && lon >= e.minLon && lat <= e.maxLat && lon <= e.maxLon
      );
    });

    return area;
  }

  get position() {
    return { lat: this.latitude, lng: this.longitude };
  }

  toString() {
    return this.name;
  }
}

export default Station;
