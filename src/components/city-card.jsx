import styled, { keyframes } from 'styled-components';
import { CgArrowLongDownL } from 'react-icons/cg';
import { ImMeter } from 'react-icons/im';
import { IoMdThermometer } from 'react-icons/io';
import { symbols, days } from './helpers/maps';

const Wind = ({ speed, direction }) => (
  <WindWrapper>
    <CgArrowLongDownL style={{ transform: `rotate(${direction}deg)` }} />
    {speed} m/s
  </WindWrapper>
);

const Symbol = ({ symbolCode }) => (
  <SymbolWrapper title={symbols[symbolCode]?.text || symbols.missing.text}>
    {symbols[symbolCode]?.emoji || symbols.missing.emoji}
  </SymbolWrapper>
);

const Temp = ({ temp }) => (
  <Temperature temp={temp}>
    <IoMdThermometer />
    {temp}°
  </Temperature>
);

const Today = ({ symbolCode, details }) => (
  <TodayWrapper>
    <Day>I dag</Day>
    <WeatherInfo>
      <MainInfo>
        <Symbol symbolCode={symbolCode} />
        <Temp temp={details.air_temperature} />
      </MainInfo>
      <SecondaryInfo>
        <div>
          vind:{' '}
          <Wind
            speed={details.wind_speed}
            direction={details.wind_from_direction}
          />
        </div>
        <Humidity>
          luftfuktighet: <ImMeter /> {details.relative_humidity}%
        </Humidity>
      </SecondaryInfo>
    </WeatherInfo>
  </TodayWrapper>
);

const UpcomingWeather = ({ timeseries }) => (
  <Table>
    <tbody>
      {timeseries.map((entry) => {
        const details = entry.data.instant.details;
        const date = new Date(entry.time).getDay();
        const today = new Date();
        const tomorrow = new Date(today.setDate(today.getDate() + 1));
        const day = tomorrow.getDay() === date ? 'I morgen' : days[date];
        const symbolCode = entry.data.next_6_hours.summary.symbol_code;

        return (
          <tr key={day}>
            <td>
              <b>{day}</b>
            </td>
            <td>
              <Symbol symbolCode={symbolCode}></Symbol>
            </td>
            <td>
              <Temp temp={details.air_temperature} />
            </td>
            <td>
              <Wind
                speed={details.wind_speed}
                direction={details.wind_from_direction}
              />
            </td>
            <td>
              <ImMeter />
              {details.relative_humidity}%
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

const CityCard = ({ name, today, upcoming, deleteLocation }) => (
  <Card>
    <Title>{name}</Title>
    <Today
      symbolCode={today.data.next_6_hours.summary.symbol_code}
      details={today.data.instant.details}
    ></Today>
    <UpcomingWeather timeseries={upcoming} />
    <Delete onClick={() => deleteLocation(name)}></Delete>
  </Card>
);

export default CityCard;

const Delete = styled.button`
  position: absolute;
  display: none;
  background: none;
  border: none;
  height: 20px;
  width: 20px;
  top: 10px;
  right: 10px;

  &:after,
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 8px;
    width: 4px;
    height: 20px;
    background: #ccc;
    transform: rotate(45deg);
  }

  &:before {
    transform: rotate(135deg);
  }

  &:hover {
    &:before,
    &:after {
      background: red;
    }
  }
`;

const scale = keyframes`
    from {transform: scale(0)}
    to {transform: scale(1)}
`;

const Card = styled.div`
  position: relative;
  padding: 10px;
  border: 2px solid #ddd;
  max-width: 400px;
  width: 100%;
  border-radius: 5px;
  margin: 10px;
  animation: ${scale} 0.3s linear;

  * svg {
    margin: 0 2px;
  }

  &:hover {
    ${Delete} {
      display: block;
    }
  }
`;

const Title = styled.h2`
  text-transform: capitalize;
  margin: 0;
`;

const Table = styled.table`
  width: 100%;
`;

const SymbolWrapper = styled.span`
  font-size: 1.3rem;
  :hover {
    cursor: default;
  }
`;

const WindWrapper = styled.span`
  transform: ${(props) => props.direction && `rotate(${props.direction}deg)`};
`;

const Temperature = styled.span`
  color: ${(props) => (props.temp > 0 ? 'red' : 'blue')};
  display: flex;
  align-items: center;
`;

const Day = styled.span`
  font-weight: bold;
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
`;

const SecondaryInfo = styled.div`
  /* text-align: right; */
`;

const MainInfo = styled.div`
  /* flex: 1; */
`;

const Humidity = styled.div`
  /*TODO wrapping*/
`;

const TodayWrapper = styled.div`
  margin: 20px 0;
  font-size: 1.2rem;

  ${SymbolWrapper} {
    font-size: 3rem;
  }
  ${Temperature} {
    font-size: 2rem;
  }
  ${MainInfo} {
    display: flex;
    align-items: center;
    flex: 1;
  }
  ${SecondaryInfo} {
    text-align: right;
    flex: 1;
  }
`;
