export const getPending = ( prereqs, teachables ) => {
  let pendingPrerequisites = [];
  prereqs = prereqs.slice(0);
  teachables = teachables.slice(0);

  prereqs.forEach( prerequisite => {
    let currentPrerequisiteTeachable = teachables.filter( teachable => teachable.id === prerequisite.requirable.data.id )[0];
    let teachableSelf = currentPrerequisiteTeachable ? currentPrerequisiteTeachable.teachableSelf : null;
    if ( !teachableSelf || !teachableSelf.data.completedAt )
      pendingPrerequisites.push( Object.assign( {}, prerequisite ) );
  } );

  return pendingPrerequisites;
}

export const hasPending = ( prereqs, teachables ) =>
  getPending( prereqs, teachables ).length > 0;