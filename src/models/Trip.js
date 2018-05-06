const Trip = (obj, stations) => ({
  bike_id: +obj.bike_id,
  duration: +obj.duration_sec,

  // TODO: Timezone is not correct in Safari
  start_station: stations.find(e => e.id === +obj.start_station_id),
  start_time: new Date(obj.start_time.replace(' ', 'T')),

  end_station: stations.find(e => e.id === +obj.end_station_id),
  end_time: new Date(obj.end_time.replace(' ', 'T')),

  user_type: +obj.user_type,
  member_birth_year: +obj.member_birth_year,
  member_gender: +obj.member_gender,
});

export default Trip;
