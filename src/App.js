import React, {useState} from 'react';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import logo from './logo.svg';
import './App.css';
// import './fontawesome.js';
// import {useSelector, useDispatch} from 'react-redux';
// import {increment, decrement, signin} from './actions';



function App() {
  const [Count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [listItems, setlistItems] = useState();
  const [itemsLeft, setItemsLeft] = useState(0);
  const [checkbox, setCheckbox] = useState(false);
  const [activeButton, setactiveButton] = useState({
    All: '',
    Active: '',
    Completed: ''
  }); 
  const [state, setState] = useState({
    All: {},
    Active: {}, 
    Completed: {}
  });
  // const numbers = [1,2,3,4];
  // const listItems = numbers.map((number) => <h4>{number}</h4>);
  
  
  const updateArray = (category, state) => {
    const arr = []; 
    for(let key in state[category]){

      arr.push({ 
        value: state[category][key].value,
        id: key
      });

    }
    // console.log(category)
    setlistItems(arr.map((item,i) => 
        <div className="panel" key = { i.toString() }>
          <label className="container">
            <input  className="toggle" type="checkbox" checked={!state[category][item.id].active} onChange={() => checkFluency(item.id, category, state, item.value)} />
            <span className="checkmark"></span>

          </label>        
          <label className={state[category][item.id].active ? "items" : "items_active"}> { item.value } </label>
          <span className="times" onClick={() => deleteItem(state, item.id)}> ×</span>
        </div>

    ));
  }


  const updateActive = () => {
    console.log(activeButton)
    switch('active'){

      case activeButton.All:
        updateArray("All",state);
        break;
      case activeButton.Active:
        updateArray("Active",state);
        break;
      case activeButton.Completed:
        updateArray("Completed",state);
        break;
      default:
        updateArray("All",state);
    }

  }

  const deleteItem = (state, id) => {
    delete state.All[id];
    delete state.Active[id];
    delete state.Completed[id]; 

    updateActive();
  }


  
  const checkFluency = (item, category, state, value) => {
    state.All[item].active = (!state.All[item].active);
    if(state.All[item].active == false){
      state.Completed[item] = {};
      state.Completed[item].value = value;
      state.Completed[item].active = false
      delete state.Active[item];
    } else {
      state.Active[item] = {};
      state.Active[item].value = value;
      state.Active[item].active = true
      delete state.Completed[item];
    }
    updateArray(category,state);
  }
  

  const clickHandler = (state,inputValue, Count, activeButton) => {
    {/*console.log(state);*/}
    state.All[Count] = {} ;
    state.All[Count].value = inputValue
    state.All[Count].active = true;
    state.Active[Count] = {} ;
    state.Active[Count].value = inputValue
    state.Active[Count].active = true;
    setCount(Count + 1);
    setInputValue('');
    // setCount(Count + 1);
    
    updateActive();

  }

  

  const handleChange = (event) => {
    
    setInputValue(event.target.value);
  }  

  const clickAll = (state) => {
    
    activeButton.All = 'active';
    activeButton.Active = '';
    activeButton.Completed = '';

    updateArray("All", state);

  } 
  
  const clickActive = (state) => {
    activeButton.All = '';
    activeButton.Active = 'active';
    activeButton.Completed = '';

    updateArray("Active", state);
  }  

  const clickCompleted = (state) => {
    activeButton.All = '';
    activeButton.Active = '';
    activeButton.Completed = 'active';
    
    updateArray("Completed", state);
  }

  const clickClear = (state, activeButton) => {
    for(let key in state.All){
      if(state.All[key].active == false){
         delete state.All[key];
      }
    }
    delete state.Completed;

    state.Completed = {}; 

    updateActive();
  }
  
  const ItemsLeft = (state) => {    
    const count = {countItem: 0};
    for(let key in state.props.Active){
      count.countItem = count.countItem + 1;
    }
    return (count.countItem);
  }

  const ItemsLeftPure = (state) => {    
    const count = {countItem: 0};
    for(let key in state.All){
      count.countItem = count.countItem + 1;
    }
    return (count.countItem);
  }


  const keyPressed = (event) => {
    if (event.key === "Enter") {
      clickHandler(state, inputValue, Count, activeButton);
    }
  }


  
  const itemsAllAmount = (state) => {
    const amountAll = {value: 0};
    
    for(let key in state.All){
      amountAll.value = amountAll.value + 1;
    }

    return amountAll.value
  }

  const itemsCompletedAmount = (state) => {
    const amountCompleted = {value: 0};
    
    for(let key in state.Completed){
      amountCompleted.value = amountCompleted.value + 1;
    }

    return amountCompleted.value
  }  


  const selectAll = (state, activeButton) => {    
    if(itemsCompletedAmount(state) == itemsAllAmount(state)){
      for(let key in state.All){
        // console.log(2)
        state.All[key].active = false;
        checkFluency(key, 'All', state, state.All[key].value)
      } 
    } else {
      for(let key in state.All){
       // console.log(state.All[key].active)
        state.All[key].active = true;
        checkFluency(key, 'All', state, state.All[key].value)
      }
    }

    updateActive();
  }

  


  return (
    <div className="App">

        <header>
            <h1 className="title">{/*<FontAwesomeIcon icon={faCheck} />*/} AddNote</h1>
        </header>
        
        <div className="shadow">
          <main className="main">
            <div class="myflexInput">
              <div className={itemsCompletedAmount(state) == itemsAllAmount(state) && itemsAllAmount(state) != 0 ? 'arrow_active' : 'arrow' } onClick={() => selectAll(state, activeButton)} />
              <input type="text" onKeyPress={keyPressed} className="input" placeholder="What needs to be done?" value={inputValue} onChange={handleChange} />
            </div>
            <div>{listItems}</div>
          </main>
          
          {ItemsLeftPure(state) ? 

            <footer className="myFooter">
              
              <div className="Row">
                <button className={activeButton.All} onClick={() => clickAll(state)}>All</button>
                <button className={activeButton.Active} onClick={() => clickActive(state)}>Active</button>
                <button className={activeButton.Completed} onClick={() => clickCompleted(state)}>Completed</button>
                <button className="clear" onClick={() => clickClear(state, activeButton)}>Clear completed</button>
                <span>items left <ItemsLeft props={state}></ItemsLeft></span>
              </div>

              {/*<div className="footerEndBig" />
              <div className="footerEndLittle"/>
            */}
            </footer> : ''}
                 
        </div>



      </div>
  );
}

export default App;



