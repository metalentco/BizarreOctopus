
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const whitelist_addresses = require('../../scripts/whitelist.js')

const handler = async (req, res) => {
  try {
    if (req.method != "POST") {
      return res.status(400).json({
        message: "This should be POST."
      });
    }
    const { address } = req.body;
    const index = whitelist_addresses.findIndex(element => {
      return element.toLowerCase() === address.toLowerCase();
    });
    if (index != -1) {
      const leaves = whitelist_addresses.map((address) => keccak256(address));
      const tree = new MerkleTree(leaves, keccak256, { sort: true });
      const root = tree.getHexRoot();

      const leaf = keccak256(address);
      const proof = tree.getHexProof(leaf);
      return res.status(200).json(
        {
          proof: proof,
          root: root,
          status: 'success'
        }
      );
    } else {
      return res.status(201).json({
        status: 'fail'
      });
    }
  } catch (err) {
    const message = error.toString();
    return res.status(400).json({ error: message });
  }
}

export default handler;