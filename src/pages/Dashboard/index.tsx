import React from 'react';
import {View, Text, Button} from 'react-native';

import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const {signOut, user} = useAuth();
  
  const {name} = user;

  return ( 
    <>
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      <Text style={{color: '#fff', fontSize: 18 }}>Bem vindo, {name}</Text>
      <Button title="Sair" onPress={signOut} />
    </View>
    </>
  )
}

export default Dashboard;