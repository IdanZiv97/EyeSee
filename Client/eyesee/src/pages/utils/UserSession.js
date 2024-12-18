class UserSession {
    // Store the user information in local storage
    static storeUserInfo(userInfo) {
        // Ensure the main store is the first in the list
        const stores = Array.isArray(userInfo.stores) ? [...userInfo.stores] : [];
        if (userInfo.mainStore) {
            // Remove the main store if it exists in the stores array
            const mainStoreIndex = stores.indexOf(userInfo.mainStore);
            if (mainStoreIndex > -1) {
                stores.splice(mainStoreIndex, 1);
            }
            // Add the main store to the beginning of the array
            stores.unshift(userInfo.mainStore);
        }

        // Save the updated data in local storage
        localStorage.setItem('userId', userInfo.userId || '');
        localStorage.setItem('username', userInfo.username || '');
        localStorage.setItem('firstName', userInfo.firstName || '');
        localStorage.setItem('lastName', userInfo.lastName || '');
        localStorage.setItem('email', userInfo.email || '');
        localStorage.setItem('mainStore', userInfo.mainStore || '');
        localStorage.setItem('stores', JSON.stringify(stores));

        console.log('User info stored successfully with main store prioritized.');
    }

    // Getters and Setters for each field
    static getUserId() {
        return localStorage.getItem('userId');
    }

    static setUserId(userId) {
        localStorage.setItem('userId', userId);
    }

    static getUsername() {
        return localStorage.getItem('username');
    }

    static setUsername(username) {
        localStorage.setItem('username', username);
    }

    static getFirstName() {
        return localStorage.getItem('firstName');
    }

    static setFirstName(firstName) {
        localStorage.setItem('firstName', firstName);
    }

    static getLastName() {
        return localStorage.getItem('lastName');
    }

    static setLastName(lastName) {
        localStorage.setItem('lastName', lastName);
    }

    static getEmail() {
        return localStorage.getItem('email');
    }

    static setEmail(email) {
        localStorage.setItem('email', email);
    }

    static getStores() {
        const stores = localStorage.getItem('stores');
        return stores ? JSON.parse(stores) : [];
    }

    static setStores(stores) {
        localStorage.setItem('stores', JSON.stringify(stores));
    }

    static getMainStore() {
        const stores = UserSession.getStores();
        return stores.length > 0 ? stores[0] : null;
    }

    static setMainStore(mainStore) {
        const stores = UserSession.getStores();
        // Remove mainStore if it already exists
        const updatedStores = stores.filter((store) => store !== mainStore);
        updatedStores.unshift(mainStore); // Add as the first item
        localStorage.setItem('stores', JSON.stringify(updatedStores));
        localStorage.setItem('mainStore', mainStore);
        console.log('Main store updated successfully.');
    }
    static updateUserInfo(userInfo){
        this.setUsername(userInfo.username);
        this.setFirstName(userInfo.firstName);
        this.setLastName(userInfo.lastName);
        this.setEmail(userInfo.email);
        this.setMainStore(userInfo.mainStore);
    }

    // Clear the user session data from local storage
    static clearUserSession() {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email');
        localStorage.removeItem('mainStore');
        localStorage.removeItem('stores');
        console.log('User session cleared.');
    }
}

export default UserSession;
