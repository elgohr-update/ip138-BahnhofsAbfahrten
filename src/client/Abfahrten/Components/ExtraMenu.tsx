import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { fav, unfav } from 'Abfahrten/actions/fav';
import { getLageplan, openFilter } from 'Abfahrten/actions/abfahrten';
import { IconButton } from '@material-ui/core';
import { openSettings } from 'Abfahrten/actions/abfahrtenConfig';
import { Station } from 'types/station';
import { ThemeType } from 'client/Themes';
import { toggleTheme } from 'Common/actions/config';
import ActionMenu from '@material-ui/icons/Menu';
import FilterList from '@material-ui/icons/FilterList';
import FilterModal from './FilterModal';
import Layers from '@material-ui/icons/Layers';
import LayersClear from '@material-ui/icons/LayersClear';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { SyntheticEvent } from 'react';
import Settings from '@material-ui/icons/Settings';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';
import WbSunny from '@material-ui/icons/WbSunny';
import WbSunnyOutlined from '@material-ui/icons/WbSunnyOutlined';

type StateProps = {
  isFaved: boolean;
  currentStation?: Station;
  lageplan?: null | string;
  theme: ThemeType;
  darkModeFeature: boolean;
};

type DispatchProps = ResolveThunks<{
  fav: typeof fav;
  unfav: typeof unfav;
  openSettings: typeof openSettings;
  openFilter: typeof openFilter;
  getLageplan: typeof getLageplan;
  toggleTheme: typeof toggleTheme;
}>;

type ReduxProps = StateProps & DispatchProps;

type Props = ReduxProps;
type State = {
  anchor?: HTMLElement;
};

class ExtraMenu extends React.PureComponent<Props> {
  state: State = {};
  toggleFav = () => {
    const { isFaved, fav, unfav, currentStation } = this.props;

    if (currentStation) {
      if (isFaved) {
        unfav(currentStation);
      } else {
        fav(currentStation);
      }
    }
  };
  toggleMenu = (e: SyntheticEvent<HTMLElement>) => {
    this.setState({
      anchor: this.state.anchor ? undefined : e.currentTarget,
    });
  };
  openLageplan = async () => {
    const { lageplan, getLageplan, currentStation } = this.props;

    this.closeMenu();

    if (lageplan === undefined && currentStation) {
      // const snackId = enqueueSnackbar(
      //   `Lade Gleisplan für ${currentStation.title}`,
      //   { variant: 'info' }
      // );
      const fetchedLageplan = await getLageplan(currentStation.title);

      if (fetchedLageplan) {
        window.open(fetchedLageplan, '_blank');
      }

      // if (snackId) {
      //   if (fetchedLageplan) {
      //     closeSnackbar(snackId);
      //     window.open(fetchedLageplan, '_blank');
      //   } else {
      //     closeSnackbar(snackId);
      //     enqueueSnackbar(
      //       `Kein Gleisplan vorhanden für ${currentStation.title}`,
      //       { variant: 'error' }
      //     );
      //   }
      // }
    } else if (lageplan) {
      window.open(lageplan, '_blank');
    }
  };
  openFilter = () => {
    this.props.openFilter();
    this.closeMenu();
  };
  closeMenu = () => {
    this.setState({
      anchor: undefined,
    });
  };
  openSettings = () => {
    this.props.openSettings();
    this.closeMenu();
  };
  render() {
    const {
      isFaved,
      currentStation,
      lageplan,
      theme,
      darkModeFeature,
    } = this.props;
    const { anchor } = this.state;

    return (
      <>
        <FilterModal />
        {darkModeFeature && (
          <IconButton
            aria-label="Toggle Theme"
            onClick={this.props.toggleTheme}
            color="inherit"
          >
            {theme === ThemeType.dark ? <WbSunnyOutlined /> : <WbSunny />}
          </IconButton>
        )}
        <IconButton aria-label="Menu" onClick={this.toggleMenu} color="inherit">
          <ActionMenu />
        </IconButton>
        <Menu
          open={Boolean(anchor)}
          anchorEl={anchor}
          onClose={this.toggleMenu}
        >
          {currentStation && [
            <MenuItem key="1" onClick={this.toggleFav}>
              {isFaved ? (
                <>
                  <ToggleStar /> Unfav
                </>
              ) : (
                <>
                  <ToggleStarBorder /> Fav
                </>
              )}
            </MenuItem>,
            <MenuItem key="2" onClick={this.openLageplan}>
              {lageplan !== null ? <Layers /> : <LayersClear />} Lageplan
            </MenuItem>,
          ]}
          <MenuItem onClick={this.openFilter}>
            <FilterList /> Filter
          </MenuItem>
          <MenuItem onClick={this.openSettings}>
            <Settings /> Settings
          </MenuItem>
        </Menu>
      </>
    );
  }
}

export default connect<StateProps, DispatchProps, {}, AbfahrtenState>(
  state => ({
    isFaved: Boolean(
      state.abfahrten.currentStation &&
        state.fav.favs[state.abfahrten.currentStation.id]
    ),
    currentStation: state.abfahrten.currentStation,
    lageplan: state.abfahrten.lageplan,
    theme: state.config.theme,
    darkModeFeature: state.features.dark,
  }),
  {
    fav,
    unfav,
    openSettings,
    getLageplan,
    openFilter,
    toggleTheme,
  }
)(ExtraMenu);