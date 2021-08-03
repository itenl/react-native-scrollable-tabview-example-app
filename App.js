import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import ScrollableTabView from './react-native-scrollable-tabview';

class Screen1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: Date.now()
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        time: Date.now()
      });
    }, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onRefresh = toggled => {
    toggled();
    alert('Screen1 onRefresh');
    // to do
    toggled();
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
        <Text>this.props {JSON.stringify(Object.keys(this.props).join('|'), null, 2)}</Text>
        <Text>this.props.topropsTextValue: {this.props.topropsTextValue}</Text>
        <Text>this.state.time: {this.state.time}</Text>
        <Text>this.props.rootTime: {this.props.rootTime}</Text>
      </View>
    );
  }
}

class Screen2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notMore: false,
      list: Array.from({ length: 10 }, (val, i) => {
        return { index: i };
      }).map((item, index) => {
        return {
          title: `--- title ${index} ---`,
          index
        };
      })
    };
  }
  onRefresh = toggled => {
    toggled(false);
    // to do
    alert('Screen1 onRefresh');
  };

  onEndReached = () => {
    if (this.state.list.length >= 50 || this.state.notMore) {
      this.setState({
        notMore: true
      });
      return;
    }
    let length = this.state.list.length;
    this.state.list = this.state.list.concat(
      Array.from({ length: 10 }, (val, i) => {
        return { index: i };
      }).map((item, index) => {
        return {
          title: `--- title ${length + index} ---`,
          index: length + index
        };
      })
    );
    this.setState({
      list: this.state.list
    });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f1f1f1', alignItems: 'center', justifyContent: 'center' }}>
        <Text>this.props {JSON.stringify(Object.keys(this.props).join('|'), null, 2)}</Text>
        <Text>this.props.topropsTextValue: {this.props.topropsTextValue}</Text>
        <Text>this.props.rootTime: {this.props.rootTime}</Text>
        {this.state.notMore && (
          <TouchableOpacity
            onPress={() => {
              // this.props.scrollTo(0);
              this.props.scrollTo(-1000);
            }}
            style={{ width: 150, height: 50, backgroundColor: 'pink', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, bottom: 200 }}
          >
            <Text>GoTop</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{
            width: 150,
            height: 50,
            backgroundColor: 'pink',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {
            this.props.toTabView('Screen1');
          }}
        >
          <Text>Go Screen1</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: '#fcfcfc', flex: 1 }}>
          {this.state.list.map((item, index) => {
            return (
              <View key={index} style={{ height: 80, borderWidth: 1, borderColor: 'pink' }}>
                <Text>{JSON.stringify(item)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

class Sticky extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }}>
        <Text>this.props {JSON.stringify(Object.keys(this.props).join('|'), null, 2)}</Text>
        {this.props.screenContext && <Text>this.props.screenContext.props.rootTime: {this.props.screenContext.props.rootTime}</Text>}
      </View>
    );
  }
}

export default class APP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rootTime: Date.now(),
      stacks: [],
      firstIndex: 0
    };
    this.useScroll = false;
  }

  initStacks() {
    return [
      {
        screen: Screen1,
        tabLabel: 'Screen1',
        toProps: {
          topropsTextValue: Math.random()
        }
      },
      {
        screen: Screen2,
        sticky: Sticky,
        toProps: {
          topropsTextValue: Math.random()
        },
        tabLabel: 'Screen2',
        badge: [
          <Text
            key={0}
            style={{
              zIndex: 1,
              position: 'absolute',
              top: 9,
              right: -3,
              width: 19,
              height: 9,
              backgroundColor: 'green',
              borderRadius: 5,
              textAlign: 'center',
              lineHeight: 9,
              color: '#ffffff',
              fontSize: 8
            }}
          >
            new
          </Text>
        ]
      }
    ];
  }

  componentDidMount() {
    this.setState({
      stacks: this.initStacks()
    });
    setTimeout(() => {
      const stacks = this.state.stacks;
      stacks[1].tabLabelRender = tabLabel => {
        return `--- ${tabLabel} ---`;
      };
      this.setState({
        stacks
      });
    }, 5000);
    this.timer = setInterval(() => {
      this.setState({
        rootTime: Date.now()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  pushStack() {
    const stacks = this.state.stacks;
    const temp = {
      screen: Screen1,
      tabLabel: `Screen${stacks.length + 1}`,
      toProps: {
        topropsTextValue: Math.random()
      }
    };
    stacks.push(temp);
    this.setState(
      {
        stacks
      },
      () => {
        global.set = index => {
          this.setState({
            firstIndex: index
          });
        };
      }
    );
  }

  pushTips() {
    if (this.useScroll) alert('Setting useScroll to true will not be able to layout');
    const stacks = this.state.stacks;
    stacks[1].badge.push(
      <View
        key={stacks[1].badge.length + 1}
        style={{
          zIndex: 100,
          marginLeft: 0,
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <View
          style={{
            zIndex: 100,
            left: 25,
            bottom: 2,
            position: 'absolute',
            right: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: 6,
            borderTopColor: '#ffffff00',
            borderRightColor: '#ffffff00',
            borderBottomColor: '#006ff6',
            borderLeftColor: '#ffffff00'
          }}
        ></View>
        <View
          style={{
            left: 100,
            marginLeft: -280,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -3,
            position: 'absolute',
            paddingHorizontal: 35
          }}
        >
          <View style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#006ff6', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ lineHeight: 16, textAlign: 'left', color: '#ffffff', fontSize: 12 }}>
              {stacks[1].badge.length} Show Tips {Math.random()}
            </Text>
          </View>
        </View>
      </View>
    );
    this.setState(stacks, () => {
      let timer = setTimeout(() => {
        this.state.stacks[1].badge.splice(this.state.stacks[1].badge.length - 1, 1);
        this.setState({
          stacks: this.state.stacks
        });
        clearTimeout(timer);
      }, 3000);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          ref={it => (this.scrollableTabView = it)}
          onTabviewChanged={(index, tabLabel) => {
            console.log(`${index},${tabLabel}`);
          }}
          mappingProps={{
            rootTime: this.state.rootTime
          }}
          stacks={this.state.stacks}
          tabsStyle={{ borderTopWidth: 0.5, borderTopColor: '#efefef' }}
          tabStyle={{ paddingHorizontal: 15, backgroundColor: 'pink' }}
          textStyle={{}}
          textActiveStyle={{
            color: 'red'
          }}
          header={() => {
            return (
              <View style={{ flex: 1, height: 180, backgroundColor: 'pink', alignItems: 'center', justifyContent: 'center' }}>
                <Text>Open up App.js to start working on your app!</Text>
                <Text>this.state.rootTime: {this.state.rootTime}</Text>
                <TouchableOpacity onPress={this.pushTips.bind(this)}>
                  <Text>Push Tips</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pushStack.bind(this)}>
                  <Text>Push Stack</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          firstIndex={this.state.firstIndex}
          onBeforeRefresh={async (next, toggled) => {
            toggled();
            setTimeout(() => {
              // to do
              toggled();
              next();
            }, 3000);
          }}
          toTabsOnTab={true}
          oneTabHidden={true}
          enableCachePage={true}
          // fixedTabs={true}
          useScroll={this.useScroll}
        ></ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

console.disableYellowBox = true;
