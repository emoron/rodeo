import _ from 'lodash';
import React from 'react';
import ForegroundPlot from './foreground-plot.jsx';
import BackgroundPlot from './background-plot.jsx';
import './plot-preview.css';
import commonReact from '../../services/common-react';

/**
 * @class PlotPreview
 * @extends ReactComponent
 * @property props
 * @property {Array} props.plots
 */
export default React.createClass({
  displayName: 'PlotPreview',
  propTypes: {
    onItemClick: React.PropTypes.func.isRequired,
    onItemRemove: React.PropTypes.func.isRequired,
    onItemSave: React.PropTypes.func.isRequired,
    plots: React.PropTypes.array.isRequired
  },
  shouldComponentUpdate(nextProps, nextState) {
    return !commonReact.shallowCompare(this, nextProps, nextState);
  },
  render: function () {
    const props = this.props,
      focusedPlot = _.find(props.plots, {hasFocus: true});

    function getActivePlotComponent(plot) {
      let plotComponent;

      if (plot && plot.data) {
        plotComponent = <ForegroundPlot data={plot.data} id={plot.id} />;
      } else if (props.plots && props.plots.length > 0) {
        plotComponent = <div className="suggestion">{'Select a plot.'}</div>;
      } else {
        plotComponent = <div className="suggestion">{'Create a plot.'}</div>;
      }

      return plotComponent;
    }

    return (
      <section className="plot-preview">
        {getActivePlotComponent(focusedPlot)}

        <nav>
          {props.plots.map((plot) => {
            return (
              <BackgroundPlot
                key={plot.id}
                onClick={_.partial(props.onItemClick, plot)}
                onRemove={_.partial(props.onItemRemove, plot)}
                onSave={_.partial(props.onItemSave, plot)}
                {...plot}
              />
            );
          })}
        </nav>
      </section>
    );
  }
});
