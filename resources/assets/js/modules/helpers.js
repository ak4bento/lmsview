import Moment from "moment";

export default {

  sortByDate: ( date1, date2 ) => {
    date1 = Moment( date1, Moment.ISO_8601 );
    date2 = Moment( date2, Moment.ISO_8601 );

    return date1.isAfter( date2 ) ? 1 : -1;
  },

  getConfig: key => {
    let configs = config.app.filter( setting => setting.id === key ).slice(0);
    if ( !configs.length )
      return null;

    return configs[0].value;
  },

  getSimpleFilesize: size => {
    let power = 1;
    let powerLabel = [
      'B', 'KB', 'MB', 'GB'
    ];
    let value = size;
    while ( size > Math.pow( 1024, power ) && power < 5 ) {
      value = Math.ceil( size / ( Math.pow( 1024, power ) ) );
      power ++;
    }

    return value + powerLabel[power - 1];
  },

  getSimpleDateDiff: date => {
    date = Moment( date );
    let value = null;
    [
      { type: 'year', beforeType: 'months', beforeLabel: 'mo' },
      { type: 'month', beforeType: 'weeks', beforeLabel: 'w' },
      { type: 'week', beforeType: 'days', beforeLabel: 'd' },
      { type: 'day', beforeType: 'hours', beforeLabel: 'h' },
      { type: 'hour', beforeType: 'minutes', beforeLabel: 'm' },
      { type: 'minute', beforeType: 'seconds', beforeLabel: 's' },
    ].forEach( threshold => {
      if ( date.isAfter( Moment().subtract( 1, threshold.type ) ) )
        value = Moment().diff( date, threshold.beforeType ) + threshold.beforeLabel;
    });
    return value || Moment().diff( date, 'years' );
  }

}