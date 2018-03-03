import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var data = require('./deals.json');
const RESTAURANTS=data.deals;

//var datatest = require('./test.json'); // forward slashes will depend on the file location
//const monjstest=datatest.la_fourchette_deals;
/*for(var i = 0; i < data.deals.length; i++) {
    
  
    console.log("Names" + data.deals[i].name );
}*/

/*class ProductCategoryRow extends React.Component {
  render() {
    const category = this.props.category;
    return (
      <tr>
        <th colSpan="2">
          {category}
        </th>
      </tr>
    );
  }
}*/

class ProductRow extends React.Component {
  render() {
    const restaurant = this.props.restaurant;

    return (
      <tr>
        <td>{restaurant.name}</td>
        <td>{restaurant.deal_title}</td>
        <td>{restaurant.stars}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    const filterText = this.props.filterText;
    const oneStarOnly = this.props.oneStarOnly;

    const rows = [];
    //let lastCategory = null;

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
      //if (product.category !== lastCategory) {
        /*rows.push(
          <ProductCategoryRow
            category={product.category}
            key={product.category} />
        );*/
      //}
      rows.push(
        <ProductRow
          restaurant={restaurant}
          key={restaurant.id_deal}
        />
      );
      //lastCategory = product.category;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>Deal</th>
            <th>Etoiles</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
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
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        <select  onChange={this.handleOneStarChange} >
          <option value="0">All stars</option>
          <option value="1">1 star only</option>
          <option value="2">2 star only</option>
          <option value="3">3 star only</option>
        </select>
      </form>
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
      <div>
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
