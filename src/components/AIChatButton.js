import { useContext } from "react"
import AIChatContext from "../context/AIChatContext"


export default AIChatButton = () => {
    const { modalVisible, setModalVisible } = useContext(AIChatContext);

    return (
        <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>AI</Text>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,       // makes it circular
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,           // shadow for Android
        shadowColor: '#000',    // shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
