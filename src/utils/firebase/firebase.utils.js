import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-R_d1-CWhoYL8gzBz0MyHcLDX9VchyCM",
  authDomain: "stock-portfolio-66a5e.firebaseapp.com",
  projectId: "stock-portfolio-66a5e",
  storageBucket: "stock-portfolio-66a5e.appspot.com",
  messagingSenderId: "1044859925233",
  appId: "1:1044859925233:web:5a525f3af9ec4a6d9aef50",
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

/* *********************************************************************************
   Users
   ****************************************************************************** */

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  const portfolioDocRef = doc(db, "portfolios", userAuth.uid);
  const portfolioSnapshot = await getDoc(portfolioDocRef);

  if (!portfolioSnapshot.exists()) {
    try {
      await setDoc(portfolioDocRef, {});
    } catch (error) {
      console.log("error creating portfolio for user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

/* *********************************************************************************
   Portfolio CRUD
   ****************************************************************************** */

/**
 * Fetches all portfolios for the user
 * @param {Object} userAuth UserAuth object
 * @param {string} portfolioName Name of portfolio to modify
 * @param {String[]} symbols     Symbols to add
 * @return {Object.<string, string[]} Dictionary of portfolio names and symbol arrays
 */
export const getAllPortfoliosForUser = async (userAuth) => {
  if (!userAuth) {
    console.log("firebase.utils getAllPortfoliosForUser has no userAuth!");
    return;
  }

  const userDocRef = doc(db, "portfolios", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);
  if (!userSnapshot.exists()) {
    console.log(
      `firebase.utils getAllPortfoliosForUser could not load portfolios`
    );
    return;
  }
  return userSnapshot.data();
};

/**
 * Add symbols to a portfolio, or create new portfolio of the symbols if does not exist
 * @param {Object} userAuth UserAuth object
 * @param {string} portfolioName Name of portfolio to modify
 * @param {String[]} symbols     Symbols to add
 */
export const addSymbolsToPortfolio = async (
  userAuth,
  portfolioName,
  symbols
) => {
  const portfolioDocRef = doc(db, "portfolios", userAuth.uid);

  await updateDoc(portfolioDocRef, {
    [portfolioName]: arrayUnion(...symbols),
  });
};

/**
 * Remove symbols from a portfolio, or create new empty portfolio if does not exist
 * @param {Object} userAuth UserAuth object
 * @param {string} portfolioName Name of portfolio to modify
 * @param {String[]} symbols     Symbols to add
 */
export const removeSymbolsFromPortfolio = async (
  userAuth,
  portfolioName,
  symbols
) => {
  const portfolioDocRef = doc(db, "portfolios", userAuth.uid);

  await updateDoc(portfolioDocRef, {
    [portfolioName]: arrayRemove(...symbols),
  });
};

/**
 * Deletes portfolios and all of their symbols
 * @param {Object} userAuth UserAuth object
 * @param {string[]} portfolioNames Names of portfolios to delete
 */
export const deletePortfolios = async (userAuth, portfolioNames) => {
  const portfolioDocRef = doc(db, "portfolios", userAuth.uid);

  const deleteDict = Object.fromEntries(
    portfolioNames.map((name) => [name, deleteField()])
  );
  await updateDoc(portfolioDocRef, deleteDict)
    .then(() => {
      console.log("Delete success.");
    })
    .catch((error) => {
      console.log("firebase.utils deletePortfolios Error: ", error);
    });
};
