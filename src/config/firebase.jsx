import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";

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
        username, email, userImg: "", verified: false
    });
};

const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
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

const getProductFromDb = async (productId, setProduct) => {
    const productsCollection = doc(db, "products", productId);

    onSnapshot(productsCollection, doc => {
        setProduct({
            id: doc.id,
            ...doc.data()
        });
    });
};

const placeABid = async (bidAmount, productId, uid) => {
    const productDoc = doc(db, "products", productId);
    const bidCollection = collection(db, "bids");

    await addDoc(bidCollection, {
        bidAmount, productId, uid,
        time: serverTimestamp()
    });

    await updateDoc(productDoc, {
        price: bidAmount
    });
};

const getBids = async (productId, setBids) => {
    const BidCollection = collection(db, "bids");

    const q = query(
        BidCollection,
        orderBy("time", "desc"),
        where("productId", "==", productId)
    );

    onSnapshot(q, async bidsDoc => {

        const bids = await Promise.all(bidsDoc.docs.map(async element => {

            const userInfoDoc = doc(db, "users", element.data().uid);
            const userInfo = await getDoc(userInfoDoc);

            return {
                ...userInfo.data(),
                ...element.data()
            }
        }));

        setBids(bids);
    });
};

const sendVerificationEmail = async () => {
    await sendEmailVerification(auth.currentUser);
};

export { getProductsFromDb, sendResetEmail, login, logout, getUserData, signup, getProductFromDb, placeABid, getBids, sendVerificationEmail, auth };