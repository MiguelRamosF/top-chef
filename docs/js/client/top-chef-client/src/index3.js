import React from 'react';
import ReactDOM from 'react-dom';


class FilteredList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialItems: [
         "Apples",
         "Broccoli",
         "Chicken",
         "Duck",
         "Eggs",
         "Fish",
         "Granola",
         "Hash Browns"
       ],
       items: []
      //inStockOnly: false
    };
    
    this.filterList = this.filterList.bind(this);
    //this.handleInStockChange = this.handleInStockChange.bind(this);
  }
  filterList(event){
    var updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item){
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: updatedList});
  }
  /*getInitialState(){
     return {
       initialItems: [
         "Apples",
         "Broccoli",
         "Chicken",
         "Duck",
         "Eggs",
         "Fish",
         "Granola",
         "Hash Browns"
       ],
       items: []
     }
  }*/
  componentWillMount(){
    this.setState({items: this.state.initialItems})
  }
  render(){
    return (
      <div className="filter-list">
        <form>
        <fieldset className="form-group">
        <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>
        </fieldset>
        </form>
      <List items={this.state.items}/>
      </div>
    );
  }
}

class List extends React.Component {
  render(){
    return (
      <ul className="list-group">
      {
        this.props.items.map(function(item) {
          return <li className="list-group-item" data-category={item} key={item}>{item}</li>
        })
       }
      </ul>
    )  
  }
}

ReactDOM.render(<FilteredList/>, document.getElementById('root'));