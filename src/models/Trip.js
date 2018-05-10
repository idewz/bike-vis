const Trip = (obj, stations, stationIndices) => ({
  bike_id: +obj.bike_id,
  duration: +obj.duration_sec,

  // TODO: Timezone is not correct in Safari
  start_station_index: stationIndices[+obj.start_station_id],
  start_station: stations[stationIndices[+obj.start_station_id]],
  start_time: new Date(obj.start_time.replace(' ', 'T')),

  end_station_index: stationIndices[+obj.end_station_id],
  end_station: stations[stationIndices[+obj.end_station_id]],
  end_time: new Date(obj.end_time.replace(' ', 'T')),

  user_type: +obj.user_type,
  member_birth_year: +obj.member_birth_year,
  member_gender: +obj.member_gender,
});

export default Trip;
