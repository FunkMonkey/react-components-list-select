import React from "react/addons";
import cx from "classnames";

var KEYS = {
  UP: 38,
  DOWN: 40,
  ESC: 27,
  ENTER: 13,
  SPACE: 32,
  J: 74,
  K: 75
};

export default class ReactComponentsListSelect extends React.Component {

  constructor( props ) {
    super( props );

    this.state = {
      focusedIndex: -1
    };
  }

  componentWillReceiveProps( nextProps ) {
    if( this.state.focusedIndex > -1 ) {
      var activeKey = this.props.children[ this.state.focusedIndex ].key;
      var foundIndex = -1;
      React.Children.forEach( nextProps.children, (child, index) => {
        if( child.key === activeKey )
          foundIndex = index;
      } );

      this.setState( { focusedIndex: foundIndex } );
    }
  }

  _focusIndex( index ) {
    this.setState( { focusedIndex: index });
  }

  focusPrevious() {
    if( this.state.focusedIndex > 0 )
      this._focusIndex( this.state.focusedIndex - 1 );
    else if ( this.props.wrapNavigation )
      this._focusIndex( React.Children.count( this.props.children ) - 1 );
  }

  focusNext() {
    if( this.state.focusedIndex + 1 < React.Children.count( this.props.children ) )
      this._focusIndex( this.state.focusedIndex + 1 );
    else if ( this.props.wrapNavigation )
      this._focusIndex( 0 );
  }

  onKeyDown( event ) {
    var key = event.keyCode;

    switch( key ) {
      case KEYS.UP: this.focusPrevious(); break;
      case KEYS.DOWN: this.focusNext(); break;
      case KEYS.ENTER: this.onItemExecute(); break;
    }
  }

  onItemExecute() {
    if( this.props.onItemExecute )
      this.props.onItemExecute( this.state.focusedIndex );
  }

  _onItemClick( event ) {
    var item = event.target;

    while( item.dataset && !( "listIndex" in item.dataset )) {
      item = item.parentNode;
    }

    if(!item)
      return; // should be impossible, but who knows...

    this._focusIndex( parseInt( item.dataset.listIndex ) );
  }

  render() {

    var items = React.Children.map( this.props.children, ( child, index) => {
      var additionalClasses = cx("react-components-list-select-item", {
          "is-focused": ( index === this.state.focusedIndex )
        });

      return React.addons.cloneWithProps( child, {
          className: additionalClasses,
          key: child.props.key,
          "data-list-index": index
        } );
    } );

    return (
      <div className={ cx( "react-components-list-select", this.props.className ) }
           onKeyDown={ this.onKeyDown.bind(this) }
           onClick={ this._onItemClick.bind( this ) }
           tabIndex={ this.props.tabIndex } >
        {items}
      </div>
    );

  }
}

ReactComponentsListSelect.defaultProps = {
  wrapNavigation: true
};

