import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";



class UserDetailServices{
    constructor(){  
        this.userDetails=null;
    }   
    async getUserDetails({ forceRefresh = false } = {}){
        if(!forceRefresh){
            const savedDetailsStr=await AsyncStorage.getItem('userDetails');
            if(savedDetailsStr){
                const savedDetails=JSON.parse(savedDetailsStr);
                this.userDetails=savedDetails;
                return savedDetails;
            }
        }
        const response=await api.makeRequest('/userDetails/getUserDetails',{
                method: 'GET'
            });
        const userDetails=response.user;
        this.userDetails=userDetails;
        await AsyncStorage.setItem('userDetails',JSON.stringify(userDetails));
        return userDetails;
    }
    async changeUserDetails(newDetails){
        const oldDetails=await this.getUserDetails();
        const updates={};
        for(const [key,value] of Object.entries(newDetails)){
            if(value!=oldDetails[key]){
                updates[key]=value;
            }
        }
        try {
            await api.makeRequest('/userDetails/setUserDetails',{
                method: 'PUT',
                body: JSON.stringify({ updates: updates })
            });
            this.userDetails={...oldDetails,...updates};
            await AsyncStorage.setItem('userDetails',JSON.stringify(this.userDetails));
            return true;
        } catch (error) {
            return false;
        }
    }
}


export default new UserDetailServices();
