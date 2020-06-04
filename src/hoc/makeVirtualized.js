import React, { Component } from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';

const makeVirtualized = (ReactSelectMe) =>
  class ReactSelectMeHOC extends Component {
    renderVirtualizedList = ({
      rowRenderer,
      rowCount,
      calculatedListHeight,
      getOptionHeight,
      listClasses,
      rowClassName,
    }) => (
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            width={width}
            height={calculatedListHeight}
            rowHeight={getOptionHeight}
            rowCount={rowCount}
            className={listClasses}
            rowClassName={rowClassName}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    );

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <ReactSelectMe {...this.props} renderVirtualizedList={this.renderVirtualizedList} virtualized />;
    }
  };

export default makeVirtualized;
