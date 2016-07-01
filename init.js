var globalProps = [ ];

readGlobalProps();

function readGlobalProps() {
    globalProps = Object.getOwnPropertyNames( window );
}

function findNewEntries() {
    var currentPropList = Object.getOwnPropertyNames( window );

    return currentPropList.filter( findDuplicate );

    function findDuplicate( propName ) {
        return globalProps.indexOf( propName ) === -1;
    }
}