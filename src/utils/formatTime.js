import moment from 'moment';

export const formatTime = time => {
  const parts = parseFloat(time)?.toFixed(2).split('.');

  const hrs = parts[0] > 24 ? 24 : parts[0];
  let min = Math.floor(parseInt(parts[1])?.toFixed(2) * 0.6);

  if (!isNaN(hrs) && hrs >= 0 && hrs <= 24) {
    return `${hrs.toString().padStart(2, '0')}:${min
      .toString()
      .padStart(2, '0')}`;
  }

  return time; // If input is invalid, keep the current value
};

export const timeToFractionalHours = time => {
  let timeString = moment(time).format('HH:mm');
  const [hours, minutes] = timeString.split(':');
  return (parseFloat(hours) + parseFloat(minutes) / 60)?.toFixed(2);
};
