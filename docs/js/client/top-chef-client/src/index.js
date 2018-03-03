import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var data = require('./deals.json');
const RESTAURANTS=data.deals;

class ProductRow extends React.Component {
  render() {
    const restaurant = this.props.restaurant;
    const stars = [];
    if(restaurant.stars=="1") stars.push(<i class="fa fa-star"></i>);
    if(restaurant.stars=="2") stars.push(<i class="fa fa-star"></i>,<i class="fa fa-star"></i>);
    if(restaurant.stars=="3") stars.push(<i class="fa fa-star"></i>,<i class="fa fa-star"></i>,<i class="fa fa-star"></i>);

    return (
      <div class="col-md-4">
      <div class="card card-01">
          <img class="card-img-top" src="https://2c6disor5j62kph211fg7v42-wpengine.netdna-ssl.com/wp-content/uploads/2017/01/IMG_6686_C_Large-300x200.jpg" alt="Card image cap"></img>
          <div class="card-body">
            <span class="badge-box">{stars}</span>
            <h4 class="card-title">{restaurant.name}</h4>
            <p class="card-text">{restaurant.deal_title}</p>
            <a href={restaurant.lafourchetteURL} class="btn btn-default text-uppercase">Go to deal !</a>
          </div>

          </div>
          </div>
      
    );
  }
}

class ProductTable extends React.Component {
  render() {
    const filterText = this.props.filterText;
    const oneStarOnly = this.props.oneStarOnly;

    const rows = [];

    this.props.restaurants.forEach((restaurant) => {
      if (restaurant.name.toLowerCase().search(filterText.toLowerCase()) === -1) {
        return;
      }
      if (oneStarOnly==="1" && !(restaurant.stars==="1")) {
        return;
      }
      if (oneStarOnly==="2" && !(restaurant.stars==="2")) {
        return;
      }
      if (oneStarOnly==="3" && !(restaurant.stars==="3")) {
        return;
      }

      rows.push(
        <ProductRow
          restaurant={restaurant}
          key={restaurant.id_deal}
        />
      );

    });

    return (

        <div class="row">

          {rows}
        </div>
            
        
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleOneStarChange = this.handleOneStarChange.bind(this);
  }
  
  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }
  
  handleOneStarChange(e) {
    this.props.ononeStarChange(e.target.value);
  }
  
  render() {
    return (


      <div class="form-group">

      <h2 class="text-center"><span>Top Chef Project</span>There's really no reason to pay full retail price for most starred restaurants because there are so many resources on the Web that can help you compare prices. This web application helps you to get the best deals on starred France's resturants</h2>    
        <label >Enter the name of the restaurant :</label>
        <form >
        <input
          class="form-control"
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        </form>
        <br/>
        <label >Filter by stars :</label>
        <select  class="form-control" onChange={this.handleOneStarChange} >
          <option value="0">All stars</option>
          <option value="1">1 star only</option>
          <option value="2">2 star only</option>
          <option value="3">3 star only</option>
        </select>
        <br/>
      </div>
      
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      oneStarOnly: "0"
    };
    
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleOneStarChange = this.handleOneStarChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }
  
  handleOneStarChange(oneStarOnly) {
    this.setState({
      oneStarOnly: oneStarOnly
    })
  }

  render() {
    return (
      
      <div class="container">
        <SearchBar
          filterText={this.state.filterText}
          oneStarOnly={this.state.oneStarOnly}
          onFilterTextChange={this.handleFilterTextChange}
          ononeStarChange={this.handleOneStarChange}
        />
        <ProductTable
          restaurants={this.props.restaurants}
          filterText={this.state.filterText}
          oneStarOnly={this.state.oneStarOnly}
        />
      </div>
      
    );
  }
}


ReactDOM.render(
  <FilterableProductTable restaurants={RESTAURANTS} />,
  document.getElementById('root')
);
