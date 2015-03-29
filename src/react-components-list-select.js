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
      selectedIndex: -1
    };
  }

  componentWillReceiveProps( nextProps ) {
    if( this.state.selectedIndex > -1 ) {
      var activeKey = this.props.children[ this.state.selectedIndex ].key;
      var foundIndex = -1;
      React.Children.forEach( nextProps.children, (child, index) => {
        if( child.key === activeKey )
          foundIndex = index;
      } );

      this.setState( { selectedIndex: foundIndex } );
    }
  }

  _selectIndex( index ) {
    this.setState( { selectedIndex: index });
  }

  selectPrevious() {
    if( this.state.selectedIndex > 0 )
      this._selectIndex( this.state.selectedIndex - 1 );
    else if ( this.props.wrapNavigation )
      this._selectIndex( React.Children.count( this.props.children ) - 1 );
  }

  selectNext() {
    if( this.state.selectedIndex + 1 < React.Children.count( this.props.children ) )
      this._selectIndex( this.state.selectedIndex + 1 );
    else if ( this.props.wrapNavigation )
      this._selectIndex( 0 );
  }

  onKeyDown( event ) {
    var key = event.keyCode;

    switch( key ) {
      case KEYS.UP: this.selectPrevious(); break;
      case KEYS.DOWN: this.selectNext(); break;
      case KEYS.ENTER: this.onItemExecute(); break;
    }
  }

  onItemExecute() {
    if( this.props.onItemExecute )
      this.props.onItemExecute( this.state.selectedIndex );
  }

  _onItemClick( event ) {
    var item = event.target;

    while( item.dataset && !( "listIndex" in item.dataset )) {
      item = item.parentNode;
    }

    if(!item)
      return; // should be impossible, but who knows...

    this._selectIndex( parseInt( item.dataset.listIndex ) );
  }

  render() {

    var items = React.Children.map( this.props.children, ( child, index) => {
      var additionalClasses = cx("react-components-list-select-item", {
          "is-selected": ( index === this.state.selectedIndex )
        });

      return React.addons.cloneWithProps( child, {
          className: additionalClasses,
          key: child.props.key,
          "data-list-index": index
        } );
    } );

    return (
      <div className={ cx( "react-components-list-select", this.props.className ) }
           tabIndex={ this.props.tabIndex }
           onKeyDown={ this.onKeyDown.bind(this) }
           onClick={ this._onItemClick.bind( this ) } >
        {items}
      </div>
    );

  }
}

ReactComponentsListSelect.defaultProps = {
  wrapNavigation: true
};

