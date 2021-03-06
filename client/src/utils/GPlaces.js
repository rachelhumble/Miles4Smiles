import React from 'react';
import PlacesAutocomplete, {
  getLatLng,
  geocodeByPlaceId,
} from 'react-places-autocomplete';
import Axios from 'axios';

//Auto-complete function that utilizes Google Maps API to run a places search based on input, auto-complete suggestions, then call the Places API to getDetails on the selected business
class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      googleMapsReady: false,
      businessName: '',
      place_id: '',
      businessUrl: '',
      businessType: '',
      script: ''
    };
  }
  
  componentDidMount() {
    this._isMounted = true;
    // Script is loaded here and state is set to true after loading
      this.loadGoogleMaps(() => {
        // Work to do after the library loads.
        if (this._isMounted) {
          this.setState({ googleMapsReady: true });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unloadGoogleMaps();
  }

  loadGoogleMaps = (callback) => {
      const existingScript = document.getElementById('googlePlacesScript');
      if (!existingScript) {
        console.log('no existing');
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_PLACES_KEY}&libraries=places`;
          script.id = 'googleMaps';
          document.body.appendChild(script);
          //action to do after a script is loaded in our case setState
          script.onload = () => {
            this.setState({script: script})
            if (callback) callback();
          };
      if (existingScript && callback) callback();
    }
  };

  // unload script when needed to avoid multiple google scripts loaded warning
  unloadGoogleMaps = () => {
    if (this.state.script) {
      this.state.script.remove();
      window.google = {}
      this.setState({address: ''})
    }
  };

  handleChange = (address) => {
    this.setState({ address });
  };

  clearPrevious = () => {
    if(this.state.address) this.setState({address: ''});
  }
  //Getting bussiness details and passing back to parent component
  getPlaceDetails = (place, status) => {
    const request = {
      placeId: this.state.place_id,
      fields: ['name', 'website', 'icon', 'formatted_address'],
    };
    Axios.get(
      `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${request.placeId}&fields=${request.fields}&key=${process.env.REACT_APP_GOOGLE_PLACES_KEY}`
    ).then((response) => {
      this.setState({
        address: response.data.result.formatted_address,
        businessName: response.data.result.name,
        businessUrl: response.data.result.website,
        businessType: response.data.result.icon,
      });
      this.props.handleBusiness(
        this.state.address,
        this.state.businessName,
        this.state.businessUrl,
        this.state.businessType
      )
    });
    this.unloadGoogleMaps();
  };

  handleSelect = (address, place_id) => {
    geocodeByPlaceId(place_id)
      .then((results) => {
        getLatLng(results[0]);
        this.setState({ place_id });
        this.getPlaceDetails();
      })
      .catch((error) => console.error('Error', error));
  };

  render() {
    if (!this.state.googleMapsReady) {
      return <p>Loading</p>;
    }
    return (
      <>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <input
                name="cBusiness"
                value={this.state.businessName}
                onChange={this.handleBusinessChange}
                {...getInputProps({
                  placeholder: 'Search Local Business...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </>
    );
  }
}

export default LocationSearchInput;
