const Trip = (obj, stations) => ({
  bike_id: +obj.bike_id,
  duration: +obj.duration_sec,

  start_station: stations[+obj.start_station_id],
  start_time: new Date(obj.start_time),

  end_station_id: stations[+obj.end_station_id],
  end_time: new Date(obj.end_time),

  user_type: obj.user_type,
  member_birth_year: +obj.member_birth_year,
  member_gender: obj.member_gender,
});

export default Trip;
