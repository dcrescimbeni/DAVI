import moment, { Duration, DurationInputArg2 } from 'moment';
import { useMemo, useState } from 'react';

export const useDuration = () => {
  const [duration, setDuration] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleConversion = (value: string) => {
    if (!value) return 0;
    return parseInt(value);
  };

  const increment = (key: string) =>
    setDuration({ ...duration, [key]: handleConversion(duration[key]) + 1 });
  const decrement = (key: string) =>
    setDuration({ ...duration, [key]: handleConversion(duration[key]) - 1 });

  // convert to number form string and then calculate
  const handleChange = (e: string, value: string) => {
    let formattedValue: number;
    if (e === '') formattedValue = 0;
    else formattedValue = parseInt(e);

    return setDuration({ ...duration, [value]: formattedValue });
  };

  const { time } = useMemo(() => {
    const convertDurationToSeconds = Object.keys(duration).reduce(
      (acc, curr) => {
        const result = acc.add(
          moment.duration(duration[curr], curr as DurationInputArg2)
        );
        return result;
      },
      moment.duration(0, 'years') as Duration
    );
    return {
      time: convertDurationToSeconds.asSeconds(),
    };
  }, [duration]);

  let result = {
    data: {
      duration,
      setDuration,
      time,
      handleChange,
      increment,
      decrement,
    },
  };

  return result;
};
