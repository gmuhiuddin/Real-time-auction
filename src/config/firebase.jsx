import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, getStorage, uploadBytes, ref } from "firebase/storage";

const firebaseConfigKey = import.meta.env.VITE_APP_FIREBASE_APP_CONFIG_KEY;

const firebaseConfig = {
    apiKey: firebaseConfigKey,
    authDomain: "real-time-aution.firebaseapp.com",
    projectId: "real-time-aution",
    storageBucket: "real-time-aution.appspot.com",
    messagingSenderId: "773219752625",
    appId: "1:773219752625:web:a463ba7a29dfc606daa090",
    measurementId: "G-780MSKWHHC"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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

    const q = query(
        productsCollection,
        where("activated", "==", true)
    );

    onSnapshot(q, doc => {
        const products = doc.docs.map(element => {
            return {
                id: element.id,
                ...element.data()
            }
        });

        setProducts(products);
    });
};

const getProductFromDb = (productId, setProduct) => {
    const productDoc = doc(db, "products", productId);

    onSnapshot(productDoc, doc => {

        if (doc?.data()?.activated) {
            setProduct({
                id: doc.id,
                ...doc.data()
            });
        } else {
            setProduct({});
        };
    });
};

const getUpComeProduct = (productId, setProduct) => {
    const productDoc = doc(db, "products", productId);

    onSnapshot(productDoc, doc => {

        if (doc?.data()?.startingTime >= new Date().getTime()) {
            setProduct({
                id: doc.id,
                ...doc.data()
            });
        } else {
            setProduct({});
        };
    });
};

const getUpCommingBid = (setProduct) => {
    const productCollection = collection(db, "products");

    onSnapshot(productCollection, doc => {
        const  pdt = [];
        doc.docs.forEach(element => {
            if(element.data().startingTime >= new Date().getTime()){
                pdt.push(element.data());
            }
        });
        
        setProduct(pdt);
    });
};

const placeABid = async (bidAmount, productId, uid, bidOwnerId) => {
    const productDoc = doc(db, "products", productId);
    const bidCollection = collection(db, "bids");

    await addDoc(bidCollection, {
        bidAmount, productId, uid, bidOwnerId,
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

const getUserProducts = async (uid, setProducts) => {
    const productsCollection = collection(db, "products");

    const q = query(
        productsCollection,
        where("uid", "==", uid)
    );

    onSnapshot(q, doc => {

        const products = doc.docs.map(element => {
            return {
                id: element.id,
                ...element.data()
            }
        });

        setProducts(products);
    });
};

const getProductForEditFromDb = (uid, productId, setProduct) => {
    const productDoc = doc(db, "products", productId);

    onSnapshot(productDoc, doc => {

        if (doc?.data() && doc?.data().uid == uid) {
            setProduct({
                id: doc.id,
                ...doc.data()
            });
        } else {
            setProduct({});
        };
    });
};

const getProductId = async () => {

    const res = await getDoc(doc(db, 'productId', 'XWoz6GX60rzwW6ZZSfOr'));
    const productId = res.data().productId;

    return productId;
};

const addMultiImagesInDatabase = async (image, imageNum) => {
    const productId = await getProductId();

    let storageRef = ref(storage, `productImages/${productId}/${imageNum}`);

    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);
    return url;
};

const addImageInDatabase = async (image) => {
    const productId = await getProductId();

    let storageRef = ref(storage, `productImage/${productId}/thumbnail`);

    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);
    return url;
};

const addProduct = async (productInfo) => {
    const productId = await getProductId();

    const productCollection = collection(db, "products");

    const product = await addDoc(productCollection, {
        ...productInfo,
        productId
    });
    
    const productIdDoc = doc(db, "productId", 'XWoz6GX60rzwW6ZZSfOr');

    await updateDoc(productIdDoc, {
        productId: productId + 1
    });

    const api = import.meta.env.VITE_APP_BACKEND_API;

    await fetch(`${api}/updateproduct/avtivateproduct`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId: product.id, startingTime: productInfo.startingTime
        })
    });
    
    await fetch(`${api}/updateproduct/deavtivateproduct`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId: product.id, expiryTime: productInfo.expiryTime
        })
    });
};

const updateProduct = async (productInfo, productId) => {
    const productDoc = doc(db, "products", productId);

    await updateDoc(productDoc, {
        ...productInfo
    });
};

const reactiveProduct = async (productInfo, productId) => {

    const api = import.meta.env.VITE_APP_BACKEND_API;

    await fetch(`${api}/updateproduct/avtivateproduct`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId, startingTime: productInfo.startingTime
        })
    });
    
    await fetch(`${api}/updateproduct/deavtivateproduct`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId, expiryTime: productInfo.expiryTime
        })
    });
};

export { getProductsFromDb, sendResetEmail, login, logout, getUserData, signup, getProductFromDb, placeABid, getBids, sendVerificationEmail, getUserProducts, getProductForEditFromDb, addMultiImagesInDatabase, addImageInDatabase, addProduct, updateProduct, reactiveProduct, getUpCommingBid, getUpComeProduct, auth };