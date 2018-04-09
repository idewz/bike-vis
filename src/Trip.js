const Trip = obj => ({
  bike_id: +obj.bike_id,
  duration: +obj.duration_sec,

  // TODO: separate station class
  start_time: new Date(obj.start_time),
  start_station_id: +obj.start_station_id,
  start_station_name: obj.start_station_name,
  start_station_latitude: +obj.start_station_latitude,
  start_station_longitude: +obj.start_station_longitude,

  end_time: new Date(obj.end_time),
  end_station_id: +obj.end_station_id,
  end_station_name: obj.end_station_name,
  end_station_latitude: +obj.end_station_latitude,
  end_station_longitude: +obj.end_station_longitude,

  user_type: obj.user_type,
  member_birth_year: +obj.member_birth_year,
  member_gender: obj.member_gender,
});

export default Trip;
