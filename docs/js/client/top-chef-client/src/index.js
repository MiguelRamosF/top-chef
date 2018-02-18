import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var data = require('./deals.json');
const RESTAURANTS=data.deals;

//var datatest = require('./test.json'); // forward slashes will depend on the file location
//const monjstest=datatest.la_fourchette_deals;
for(var i = 0; i < data.deals.length; i++) {
    
  
    console.log("Name:" + data.deals[i].resaurant );
}

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
    const name = restaurant.name;

    return (
      <tr>
        <td>{name}</td>
        <td>{restaurant.deal_title}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    const filterText = this.props.filterText;
    //const inStockOnly = this.props.inStockOnly;

    const rows = [];
    //let lastCategory = null;

    this.props.restaurants.forEach((restaurant) => {
      if (restaurant.name.indexOf(filterText) === -1) {
        return;
      }
      /*if (inStockOnly && !product.stocked) {
        return;
      }*/
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
          key={restaurant.name}
        />
      );
      //lastCategory = product.category;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Deal</th>
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
    //this.handleInStockChange = this.handleInStockChange.bind(this);
  }
  
  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }
  
  /*handleInStockChange(e) {
    this.props.onInStockChange(e.target.checked);
  }*/
  
  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        <p>
          {' '}
          Only show restaurants in stock
        </p>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      //inStockOnly: false
    };
    
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    //this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }
  
  /*handleInStockChange(inStockOnly) {
    this.setState({
      inStockOnly: inStockOnly
    })
  }*/

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          //inStockOnly={this.state.inStockOnly}
          onFilterTextChange={this.handleFilterTextChange}
          //onInStockChange={this.handleInStockChange}
        />
        <ProductTable
          restaurants={this.props.restaurants}
          filterText={this.state.filterText}
          //inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}


/*const restaurants = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];*/
/*const restaurants = {"deals":
[{"name":"Le Grand Cap","id_restaurant":"25902","deal_title":"-30% off the \"à la carte\" menu!"},
 {"name":"Le Gambetta","id_restaurant":"79244","deal_title":"-20% off the \"à la carte\"!"}
]};*/




ReactDOM.render(
  <FilterableProductTable restaurants={RESTAURANTS} />,
  document.getElementById('root')
);
