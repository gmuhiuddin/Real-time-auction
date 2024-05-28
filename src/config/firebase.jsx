import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMFEBXhwuNu3yhswTfoPqkSz_bKeylZq0",
  authDomain: "real-time-aution.firebaseapp.com",
  projectId: "real-time-aution",
  storageBucket: "real-time-aution.appspot.com",
  messagingSenderId: "773219752625",
  appId: "1:773219752625:web:a463ba7a29dfc606daa090",
  measurementId: "G-780MSKWHHC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    const { user: { uid } } = await createUserWithEmailAndPassword(auth, email, password);

    const userDataCollection = doc(db, "users", uid);

    await setDoc(userDataCollection, {
        username, email, userImg: ""
    });
};

const login = async (email, password) => {
    const user = await signInWithEmailAndPassword(auth, email, password);
};

const logout = async () => {
    await signOut(auth);
};

const getUserData = async (uid) => {
    const userDataCollection = doc(db, "users", uid);

    return await getDoc(userDataCollection);
};

const sendResetEmail = async (email) => {
    await sendPasswordResetEmail(auth, email);
};

const getProductsFromDb = async (setProducts) => {
    const productsCollection = collection(db, "products");

    onSnapshot(productsCollection, doc => {
        const products = doc.docs.map(element => {
            return {
                id: element.id,
                ...element.data()
            }
        });

        setProducts(products);
    });
};

export { getProductsFromDb, sendResetEmail, login, logout, getUserData, signup, auth };