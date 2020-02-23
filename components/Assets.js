import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, View, Image, Button, Picker, ScrollView } from 'react-native'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component'
import DateTimePicker from '@react-native-community/datetimepicker'
import Database from '../Database'
import { TouchableOpacity } from 'react-native-gesture-handler'

let db = new Database()

class MultiSelect extends Component { 
  update = (type) => {
    if (type != '0') {
      this.props.onInputChange({ value: type })
    } else {
      this.props.onInputChange({ error: 1 })
    }
  }
  render() {
    return (
      <View>
        {this.props.state.error > 0 && <Text style={{color: '#F00'}}>Bad Input!</Text>}
        <Picker
          selectedValue={this.props.state.value}
          style={this.props.style}
          onValueChange={this.update}>
          <Picker.Item label={this.props.placeholder} value='0' key='0' />
          {this.props.items.map((value) => {
            return <Picker.Item label={value} value={value} key={value} />
          })}
        </Picker>
      </View>
    )
  }
}

class UserInput extends Component {
  render() {
    return (
      <View>
        {this.props.state.error > 0 && <Text style={{color: '#F00'}}>Bad Input!</Text>}
        <TextInput style={this.props.style} onChangeText={this.props.onInputChange} value={this.props.state.value} placeholder={this.props.ph} />
      </View>
    )
  }
}

class AddMenu extends Component {
  constructor(props) {
    super(props)
  }
  
  items = ['Transportation','Food','Groceries','Utilities','Hobbies','Others']

  state = {
    type: {value: '0', error: 0},
    amount: {value: "", error: 0},
    info: {value: "", error: 0}
  }

  submitExpense(x) {
    if (this.state.amount.value != "" && !this.state.amount.error && !this.state.info.error && this.state.type.value != '0') {
      db.insertExpense(this.state)
      this.setState({
        type: {value: '0', error: 0},
        amount: {value: "", error: 0},
        info: {value: "", error: 0}
      })
    } else if (this.state.type.value == '0') {
      this.setState({ type: { value: '0', error: 1 } })
    } else if (this.state.amount.value == "") {
      this.setState({ amount: { value: "", error: 1 } })
    }
  }

  onTypeChange = (type) => {
    this.setState({ type: type })
  }

  onInfoChange = (info) => {
    this.setState({ info: { value: info } })
  }

  onAmountChange = (value) => {
    if (!isNaN(value)) {
      this.setState({ amount: { value: value, error: 0 } })
    } else {
      this.setState({ amount: { value: value, error: 1 } })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Insert your new expenses today!</Text>
        {this.state.error > 0 && <Text style={{color: '#F00'}}>Bad Input!</Text>}
        <MultiSelect placeholder="Pick expense type!" style={[{width: 300},styles.btn1]} items={this.items} state={this.state.type} onInputChange={this.onTypeChange} />
        <UserInput onInputChange={this.onAmountChange} style={[{width: 300},styles.btn1]} state={this.state.amount} ph="Amount" />
        <UserInput onInputChange={this.onInfoChange} style={[{width: 300},styles.btn1]} state={this.state.info} ph="Information (Optional)" />
        <View style={styles.btn2}>
          <Button onPress={this.submitExpense.bind(this,this.state)} style={styles.btn1} title="Save!"/>
        </View>
      </View>
    )
  }
}

class ShowMenu extends Component {
  state = { 
    es: "",
    selection: {value: '0', error: 0},
    type: {value: '0', error: 0},
    id: {value: '', error: 0},
    sdate: {value: new Date(0), show: false},
    edate: {value: new Date(), show: false}
  }
  constructor() {
    super()
    let x = async () => {
      let s = this.state.sdate.value
      let e = this.state.edate.value
      s = s.getFullYear()+'-'+((s.getMonth()+1 >= 10) ? '':'0')+(s.getMonth()+1)+'-'+((s.getDate() >= 10) ? '':'0')+s.getDate()
      e = e.getFullYear()+'-'+((e.getMonth()+1 >= 10) ? '':'0')+(e.getMonth()+1)+'-'+((e.getDate() >= 10) ? '':'0')+e.getDate()
      let a = await db.listExpense(0,0,s,e)
      this.setState({size: a[0], title: a[1], es: a.splice(2)}) 
    }
    x()
  }

  selection = ['ALL','SUM(amount)','MAX(amount)','MIN(amount)','AVG(amount)']
  type = ['ALL','Transportation','Food','Groceries','Utilities','Hobbies','Others']

  onSelectionChange = (selection) => {
    this.setState({ selection })
  }

  onTypeChange = (type) => {
    this.setState({ type })
  }

  onIdChange = (id) => {
    if (!isNaN(id)) {
      this.setState({ id: { value: id, error: 0 } })
    } else {
      this.setState({ id: { value: id, error: 1 } })
    }
  }

  onSDateChange = (event, date) => {
    if (event.type == "set") this.setState({ sdate: {value: date} })
  }

  onEDateChange = (event, date) => {
    if (event.type == "set") this.setState({ edate: {value: date} })
  }


  requestQuery = () => {
    let x = async () => {
      let s = this.state.sdate.value
      let e = this.state.edate.value
      s = s.getFullYear()+'-'+((s.getMonth()+1 >= 10) ? '':'0')+(s.getMonth()+1)+'-'+((s.getDate() >= 10) ? '':'0')+s.getDate()
      e = e.getFullYear()+'-'+((e.getMonth()+1 >= 10) ? '':'0')+(e.getMonth()+1)+'-'+((e.getDate() >= 10) ? '':'0')+e.getDate()
      let a = await db.listExpense(this.state.selection.value,this.state.type.value,s,e)
      this.setState({size: a[0], title: a[1], es: a.splice(2)}) 
    }
    x()
  }

  deleteQuery = () => {
    if (!this.state.id.error) {
      let x = async () => {
        await db.deleteExpense(this.state.id.value)
        let s = this.state.sdate.value
        let e = this.state.edate.value
        s = s.getFullYear()+'-'+((s.getMonth()+1 >= 10) ? '':'0')+(s.getMonth()+1)+'-'+((s.getDate() >= 10) ? '':'0')+s.getDate()
        e = e.getFullYear()+'-'+((e.getMonth()+1 >= 10) ? '':'0')+(e.getMonth()+1)+'-'+((e.getDate() >= 10) ? '':'0')+e.getDate()
        let a = await db.listExpense(this.state.selection.value,this.state.type.value,s,e)
        this.setState({size: a[0], title: a[1], es: a.splice(2)}) 
      }
      x()
    }
  }

  pickSDate = () => {
    this.setState({sdate: {value: this.state.sdate.value, show: true}})
  }
  pickEDate = () => {
    this.setState({edate: {value: this.state.edate.value, show: true}})
  }

  render() {
    if (this.state.es) {
      return(
        <View>
          <View style={styles.container2}>
            <MultiSelect placeholder="Pick selection!" style={[{width:150},styles.btn1]} items={this.selection} state={this.state.selection} onInputChange={this.onSelectionChange} />
            <MultiSelect placeholder="Pick type!" style={[{width:150},styles.btn1]} items={this.type} state={this.state.type} onInputChange={this.onTypeChange} />
            </View>
          <View style={styles.container2}>
            <TouchableOpacity style={[{width:150,borderWith: 1},styles.btn1]} onPress={this.pickSDate}><Text>{this.state.sdate.value.toLocaleDateString()}</Text></TouchableOpacity>
            {this.state.sdate.show && <DateTimePicker
              timeZoneOffsetInMinutes={0}
              value={this.state.sdate.value}
              mode="date"
              display="default"
              onChange={this.onSDateChange}
            />}
            <TouchableOpacity style={[{width:150,borderWith: 1},styles.btn1]} onPress={this.pickEDate}><Text>{this.state.edate.value.toLocaleDateString()}</Text></TouchableOpacity>
            {this.state.edate.show && <DateTimePicker
              timeZoneOffsetInMinutes={0}
              value={this.state.edate.value}
              mode="date"
              display="default"
              onChange={this.onEDateChange}
            />}
          </View>
          <View style={styles.container2}>
            <TouchableOpacity style={[{width:300,backgroundColor:'#6AF'},styles.btn1]} onPress={this.requestQuery}><Text>Done!</Text></TouchableOpacity>
          </View>
          <View style={styles.container2}>
            <UserInput onInputChange={this.onIdChange} style={[{width:200},styles.btn1]} state={this.state.id} ph="Enter id expense..."/>
            <TouchableOpacity style={[{width:100,backgroundColor:'#F77'},styles.btn1]} onPress={this.deleteQuery}><Text>Delete!</Text></TouchableOpacity>
          </View>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Row flexArr={this.state.size} data={this.state.title} style={{backgroundColor: '#0CA', height: 40}} textStyle={{padding: 5}}/>  
          </Table>
          <ScrollView style={{height: 350}}>
            <Table>
              <Rows flexArr={this.state.size} data={this.state.es} style={{height: 40}} textStyle={{padding: 5}}/>
            </Table>
          </ScrollView>
        </View>
      )
    } else {
      return(
        <View>
        </View>
      )
    }
  }
}

class MainMenu extends Component { 
  constructor({navigation}) {
    super()
    this.nav = navigation
  }
  onShow() {
    this.nav.navigate('Show Expenses')
  }
  
  onSave() {
    this.nav.navigate('Add Expenses')
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to the App!</Text>
        <View style={styles.btn2}>
          <Button onPress={this.onShow.bind(this)} title="Show Expenses"/>
        </View>
        <View style={styles.btn2}>
          <Button onPress={this.onSave.bind(this)} title="Save Expense"/>
        </View>
      </View>
    )
  }
}

module.exports = {
  AddMenu: AddMenu,
  ShowMenu: ShowMenu,
  MainMenu: MainMenu,
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    height:60, 
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center'
  },
  btn1: {
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: '#AAA',
  },
  btn2: {
    height: 50,
    width: 320,
    padding: 10,
  },
  text: {
    fontSize: 17,
    height: 50,
    width: 300,
    marginBottom: 10,
  }
})
