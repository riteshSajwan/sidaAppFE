import { StyleSheet } from 'react-native';
const Menustyle = StyleSheet.create({
  container: {
    paddingHorizontal: 17,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical:13,
    paddingHorizontal:10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius:50
  },

  Avatarimage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginLeft: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '100%',
  },
  unBlockAction: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '100%',
  },
  roundimage: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  }
});
export default Menustyle
