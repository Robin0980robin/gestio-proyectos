import useAuthStore from './stores/authStore';
import PrivateNavigation from './navigation/PrivateNavigation';
import PublicNavigation from './navigation/PublicNavigation';

function App() {
  const isAuth = useAuthStore(state => state.isAuth)
  const logout = useAuthStore(state => state.logout)

  if(isAuth){
    return <PrivateNavigation />
  }else{
    return <PublicNavigation />
  }

}

export default App;
